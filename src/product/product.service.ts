import { Injectable, NotFoundException } from '@nestjs/common'
import { ModelType } from '@typegoose/typegoose/lib/types'
import { SortOrder, Types } from 'mongoose'
import { InjectModel } from 'nestjs-typegoose'
import { TelegramService } from 'src/telegram/telegram.service'
import { CreateProductDto } from './dto/create-product.dto'
import { ProductModel } from './product.model'


@Injectable()
export class ProductService {
  constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>, private readonly telegramService: TelegramService) { }


  async bySlug(slug: string) {
    const doc = await this.productModel.findOne({ slug }).populate('category add').exec()
    if (!doc) throw new NotFoundException('Product not found')
    return doc
  }


  async getProducts(searchTerm?: string, page?: string, orderBy?: SortOrder | { $meta: "textScore"; }, sortBy?: string, categoryIds?: Types.ObjectId[]) {
    let options = {}

    if (categoryIds) options = { category: { $in: categoryIds } }

    if (searchTerm) options = { $or: [{ title: new RegExp(searchTerm, 'i') }] }


    const query = this.productModel.find(options)
    // const total = await this.ProductModel.count(options).exec()
    const pageOf = parseInt(page) || 1


    if (sortBy && orderBy) {
      if (sortBy === 'title') {
        query.sort({ 'title': orderBy })
      }
      else if (sortBy === 'rating') {
        query.sort({ 'rating': orderBy })
      }
      else {
        query.sort({ 'countOpened': orderBy })
      }
    }

    const limit = 6

    const data = await query.skip((pageOf - 1) * limit).limit(limit).populate('category add').exec()

    // total,
    // pageOf,
    // last_page: Math.ceil(total / limit)

    return data
  }

  async byCategory(categoryIds: Types.ObjectId[]) {
    const doc = await this.productModel.find({ category: { $in: categoryIds } }).exec()
    if (!doc) throw new NotFoundException('Product not found')
    return doc
  }

  async updateRating(id: string, newRating: number) {
    return this.productModel
      .findByIdAndUpdate(id, { rating: newRating }, { new: true })
      .exec()
  }



  async getMostPopular() {
    return await this.productModel.find({ countOpened: { $gt: 0 } }).sort({ countOpened: -1 }).populate('category add').exec()
  }

  async updateCountOpened(slug: string) {
    const updateDoc = await this.productModel.findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } }, { new: true }).exec()

    if (!updateDoc) throw new NotFoundException('Add not found')

    return updateDoc
  }


  /* Admin place */

  async byId(_id: string) {
    const doc = await this.productModel.findById(_id)
    if (!doc) throw new NotFoundException('Product not found')
    return doc
  }

  async update(_id: string, dto: CreateProductDto) {

    if (!dto.isSendTelegram) {
      await this.sendNotification(dto)
      dto.isSendTelegram = true
    }
    const updateDoc = await this.productModel.findByIdAndUpdate(_id, dto, { new: true }).exec()

    if (!updateDoc) throw new NotFoundException('Product not found')

    return updateDoc
  }

  async create() {
    const defaultValue: CreateProductDto = {
      logo_image: '',
      image: '',
      title: '',
      slug: '',
      description_short: '',
      description_full: '',
      levelSetting: {
        warmInsulation: 0,
        soundInsulation: 0,
        lightInsulation: 0
      },
      parameters: {
        rang: 0,
        basic_profile_width: 0,
        count_cell: 0,
        accessories: 'Roto',
        double_glazed_window: 0,
        number_of_sealing_contours: 0,
        color: 'Черный'
      },
      add: [],
      category: [],
    }

    const Product = await this.productModel.create(defaultValue)
    return Product._id
  }

  async getCollections() {
    const products = await this.getProducts()
    const collections = products
    return collections
  }

  async delete(id: string) {
    const deleteDoc = await this.productModel.findByIdAndDelete(id).exec()

    if (!deleteDoc) throw new NotFoundException('product not found')

    return deleteDoc
  }
  async sendNotification(dto: CreateProductDto) {

    await this.telegramService.sendPhoto('https://grain-prof.ru/upload/thumbs/ccc/ccc7afc7274dedd594a2902c37a54d4a.png')

    const msg = `<b>🆕Новый товар  уже на сайте!  ${dto.title} </b>`

    await this.telegramService.sendMessage(msg, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              url: 'http://www.invest-trade.biz/',
              text: ' Перейти на сайт'
            }
          ],
        ],
      }
    })

  }
}
