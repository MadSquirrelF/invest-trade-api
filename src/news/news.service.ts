import { Injectable, NotFoundException, Options } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { InjectModel } from 'nestjs-typegoose';
import { TelegramService } from 'src/telegram/telegram.service';
import { NewsDto } from './dto/news.dto';
import { NewsModel } from './news.model';

@Injectable()
export class NewsService {
  constructor(@InjectModel(NewsModel) private readonly NewsModel: ModelType<NewsModel>, private readonly telegramService: TelegramService) { }

  async bySlug(slug: string) {
    const doc = await this.NewsModel.findOne({ slug }).exec()
    if (!doc) throw new NotFoundException('New not found')
    return doc
  }

  async updateLike(slug: string) {
    const updateDoc = await this.NewsModel.findOneAndUpdate({ slug }, { $inc: { countLiked: 1 } }, { new: true }).exec()

    if (!updateDoc) throw new NotFoundException('New not found')

    return updateDoc
  }

  async getAll(searchTerm?: string) {
    let options = {}

    if (searchTerm) options = { $or: [{ title: new RegExp(searchTerm, 'i') }] }
    return this.NewsModel.find(options).select(' -__v')
      .sort({ createdAt: 'desc' }).exec()
  }

  async updateCountOpened(slug: string) {
    const updateDoc = await this.NewsModel.findOneAndUpdate({ slug }, { $inc: { countOpened: 1 } }, { new: true }).exec()

    if (!updateDoc) throw new NotFoundException('New not found')

    return updateDoc
  }

  /* Admin place */

  async byId(_id: string) {
    const New = await this.NewsModel.findById(_id)
    if (!New) throw new NotFoundException('New not found')
    return New
  }

  async update(_id: string, dto: NewsDto) {

    if (!dto.isSendTelegram) {
      await this.sendNotification(dto)
      dto.isSendTelegram = true
    }
    const updateDoc = await this.NewsModel.findByIdAndUpdate(_id, dto, { new: true }).exec()

    if (!updateDoc) throw new NotFoundException('New not found')

    return updateDoc
  }

  async create() {
    const defaultValue: NewsDto = {
      title: '',
      slug: '',
      image_1: '',
      username: 'Администратор',
      description_short: '',
      description_full: '',
    }

    const Add = await this.NewsModel.create(defaultValue)
    return Add._id
  }

  async delete(id: string) {
    const deleteDoc = await this.NewsModel.findByIdAndDelete(id).exec()

    if (!deleteDoc) throw new NotFoundException('New not found')

    return deleteDoc
  }

  async sendNotification(dto: NewsDto) {

    await this.telegramService.sendPhoto(`https://sun9-west.userapi.com/sun9-9/s/v1/ig2/0BFIJsSLdv_7Mu5qqqUspNipZmw999vtpeBBiVkP9YkK_sB2po2HX54zvg8o7AMBdGMNRlQFqv_yR8U2JQV9bJWI.jpg?size=2160x2160&quality=96&type=album`)

    const msg = `<b>🆕Новая новость уже ждет тебя на нашем сайте! 🗔 ${dto.title} 🗔</b>`

    await this.telegramService.sendMessage(msg, {
      reply_markup: {
        inline_keyboard: [
          [
            {
              url: 'https://vk.com/public202627186',
              text: '👀 Смотреть новости!'
            }
          ],
        ],
      }
    })

  }
}
