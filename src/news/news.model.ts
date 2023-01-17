import { prop, Ref } from "@typegoose/typegoose";
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses";
import { UserModel } from "src/user/user.model";


export interface NewsModel extends Base { }

export class NewsModel extends TimeStamps {
  @prop()
  title: string

  @prop()
  slug: string

  @prop()
  description_short: string

  @prop()
  description_full: string

  @prop({ default: 0 })
  countOpened: number

  @prop()
  image_1: string

  @prop()
  image_2?: string

  @prop()
  image_3?: string

  @prop()
  username: string

  @prop({ default: false })
  isSendTelegram?: boolean

}