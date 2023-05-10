import { Injectable, NotFoundException } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { OrderModel } from "./order.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { CreateOrderDto } from "./dto/order.dto"
import { UserModel } from "src/user/user.model"
import { TelegramService } from "src/telegram/telegram.service"
import { UpdateOrderDto } from "./dto/update-order.dto"

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrderModel)
    private readonly orderModel: ModelType<OrderModel>,
    private readonly telegramService: TelegramService
  ) { }

  async byId(_id: string) {
    const order = await this.orderModel.findById(_id).populate('user').exec()
    if (!order) throw new NotFoundException('Order not found')
    return order
  }

  async getAllUserOrders(user: UserModel) {
    const { _id } = user
    let options = {}
    options = { user: { $in: _id } }
    return this.orderModel.find(options).select('-updatedAt -__v').populate('user').sort({ createdAt: 'desc' }).exec()
  }

  async updateOrder(orderId: string, dto: UpdateOrderDto, user: UserModel) {

    if (!dto.isSendTelegram) {
      await this.sendTelegramNotion(user,dto)
      dto.isSendTelegram = true
    }
    
    const { _id } = user

    const order = await this.orderModel.findOneAndUpdate({ orderId , user: { $in: _id } }, dto, {new: true}).exec()

    if (!order) throw new NotFoundException('Order not found')
   
    return order
  }

  async deleteOrder(id: string) {
    const deleteOrder = await this.orderModel.findByIdAndDelete(id).exec()

    if (!deleteOrder) throw new NotFoundException('Order not found')

    return deleteOrder
  }

  async cancelOrder(orderId: string, user: UserModel) {

    const { _id } = user

    const cancelOrder = await this.orderModel.findOneAndUpdate(
      { orderId , user: { $in: _id } },
      { status: 'Заказ отменен' },
    ).exec()

    if (!cancelOrder) throw new NotFoundException('Order not found');
  }


  
  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) options = { $or: [{ id: new RegExp(searchTerm, 'i') }] }
    return this.orderModel.find(options).select('-updatedAt -__v').populate('user').sort({ createdAt: 'desc' }).exec()
  }


  async createOrder(user: UserModel, dto: CreateOrderDto ) {

    const { total_count , items } =  dto

    
    const newOrder = {
      total_count: total_count,
      items: items,
      user: user
    }

    const Order = await this.orderModel.create(newOrder);

    return Order._id
  }


  async sendTelegramNotion(user: UserModel, dto: UpdateOrderDto) {

    const { username, email , phone_number  } = user

    const { payment , address } = dto

    await this.telegramService.sendPhoto('https://cdn-icons-png.flaticon.com/512/6384/6384900.png')

    const msg = `<strong>🆕Новый заказ уже на сайте! </strong>
    \n<b>🧑: ${username}.</b>
    \n<b>📨: ${email}.</b>
    \n<b>☎: ${phone_number === '' ? 'Не указан' : phone_number}.</b>
    \n<b>🏧: ${payment}.</b>
    \n<b>🏘: ${address.country},г.${address.city},${address.street}.</b>`

    await this.telegramService.sendMessage(msg, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              url: 'https://invest-trade.biz/manage/orders',
              text: 'Открыть новый заказ'
            }
          ],
        ],
      }
    })

  }
}
