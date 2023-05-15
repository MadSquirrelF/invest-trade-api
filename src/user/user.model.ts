import { prop, Ref } from "@typegoose/typegoose"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { OrderModel } from "src/order/order.model"
import { ProductModel } from "src/product/product.model"

export interface UserModel extends Base { }

export class UserModel extends TimeStamps {
  @prop({ unique: true })
  email: string

  @prop()
  username: string

  @prop({ default: "Мужской" })
  sex: string

  @prop({ default: "/uploads/users/default.svg" })
  avatar: string

  @prop()
  phone_number: string

  @prop()
  password: string

  @prop({ default: false })
  isAdmin?: boolean

  @prop({ default: [], ref: () => ProductModel })
  favorites?: Ref<ProductModel>[]
}