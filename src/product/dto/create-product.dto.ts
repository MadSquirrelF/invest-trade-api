import { Type } from "class-transformer"
import { ArrayMaxSize, ArrayMinSize, IsArray, IsBoolean, IsNumber, isObject, IsObject, IsString } from "class-validator"

export class ParametersProf {
  @IsString()
  rang: number
  @IsNumber()
  basic_profile_width: number
  @IsNumber()
  count_cell: number
  @IsString()
  accessories: string
  @IsString()
  color: string
  @IsNumber()
  double_glazed_window: number
  @IsNumber()
  number_of_sealing_contours: number
}

export class LevelParams {
  @IsNumber()
  warmInsulation: number
  @IsNumber()
  soundInsulation: number
  @IsNumber()
  lightInsulation: number
}

export class CreateProductDto {
  @IsString()
  image: string

  @IsString()
  logo_image: string

  @IsString()
  title: string

  @IsString()
  slug: string

  @IsString()
  description_short: string

  @IsString()
  description_full: string

  @IsObject()
  levelSetting: LevelParams

  @IsObject()
  parameters: ParametersProf

  @IsArray()
  @IsString({ each: true })
  category: string[]

  @IsArray()
  @IsString({ each: true })
  add: string[]

  isSendTelegram?: boolean

}