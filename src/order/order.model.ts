import { Ref, prop } from "@typegoose/typegoose"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { ProductModel } from "src/product/product.model"
import { UserModel } from "src/user/user.model"

export interface OrderModel extends Base { }

export class OrderModel extends TimeStamps {
  @prop({ default: "Ожидание звонка" })
  status: string

  @prop()
  total_count: number

  @prop({ default: "По карте" })
  payment: string;

  @prop({ ref: () => UserModel })
  userId: Ref<UserModel>

  @prop({ ref: () => ProductModel })
  items: Ref<ProductModel>[]
}