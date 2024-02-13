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

  @prop({ default: '' })
  firstname: string

  @prop({ default: '' })
  lastname: string

  @prop({ default: 'RUSSIA' })
  country: string

  @prop({ default: '' })
  city: string

  @prop({ default: '' })
  address: string

  @prop({ default: 18 })
  age: number

  @prop({ default: "RUB" })
  currency: string

  @prop({ default: "Мужской" })
  sex: string

  @prop({ default: "/uploads/users/default.svg" })
  avatar: string

  @prop({ default: "" })
  phone_number: string

  @prop()
  password: string

  @prop({ default: 'USER' })
  roles?: string

  @prop({ default: [], ref: () => ProductModel })
  favorites?: Ref<ProductModel>[]
}