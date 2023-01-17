import { IsNumber, IsObject, IsString } from "class-validator"
import { UpdateUserDto } from "src/user/dto/user-update.dto"

export class NewsDto {
  @IsString()
  title: string

  @IsString()
  slug: string

  @IsString()
  description_short: string

  @IsString()
  description_full: string

  @IsString()
  image_1: string

  @IsString()
  image_2?: string

  @IsString()
  image_3?: string

  @IsString()
  username: string

  countOpened?: number

  isSendTelegram?: boolean
}