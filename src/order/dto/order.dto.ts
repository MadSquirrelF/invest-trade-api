import { IsArray, IsNumber, IsString } from "class-validator"

export class CreateOrderDto {
  @IsString()
  status: string
  
  @IsString()
  userId: string;

  @IsString()
  payment: string

  @IsNumber()
  total_count: number

  @IsArray()
  @IsString({ each: true })
  items: string[]
}