import { Injectable } from "@nestjs/common"
import { InjectModel } from "nestjs-typegoose"
import { OrderModel } from "./order.model"
import { ModelType } from "@typegoose/typegoose/lib/types"
import { ProductService } from "src/product/product.service"
import { Types } from "mongoose"
import { CreateOrderDto } from "./dto/order.dto"

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(OrderModel)
    private readonly orderModel: ModelType<OrderModel>,
    private readonly productService: ProductService
  ) { }

  async createOrder(userId: Types.ObjectId, dto: CreateOrderDto ) {
    const Order = await this.orderModel.create(dto);
    
  }

  
}
