import { prop, Ref } from "@typegoose/typegoose"
import { Base, TimeStamps } from "@typegoose/typegoose/lib/defaultClasses"
import { AddModel } from "src/adds/add.model"
import { CategoryModel } from "src/category/category.model"

export interface ProductModel extends Base { }

export class ParametersProf {
  @prop()
  rang: number
  @prop()
  basic_profile_width: number
  @prop()
  count_cell: number
  @prop()
  accessories: string
  @prop()
  double_glazed_window: number
  @prop()
  number_of_sealing_contours: number
  @prop()
  color: string
}

export class LevelParams {
  @prop()
  warmInsulation: number
  @prop()
  soundInsulation: number
  @prop()
  lightInsulation: number
}




export class ProductModel extends TimeStamps {
  @prop()
  image: string

  @prop()
  logo_image: string

  @prop()
  title: string

  @prop()
  description_short: string

  @prop()
  description_full: string

  @prop()
  levelSetting: LevelParams

  @prop({ default: 4.0 })
  rating?: number

  @prop({ default: 0 })
  countOpened?: number

  @prop({ unique: true })
  slug: string

  @prop()
  parameters: ParametersProf

  @prop({ ref: () => CategoryModel })
  category: Ref<CategoryModel>[]

  @prop({ ref: () => AddModel })
  add: Ref<AddModel>[]

  @prop({ default: false })
  isSendTelegram?: boolean
}