import { IsString } from "class-validator"

export class WorksDto {
  @IsString()
  title: string

  @IsString()
  slug: string

  @IsString()
  description: string

  @IsString()
  poster: string
}