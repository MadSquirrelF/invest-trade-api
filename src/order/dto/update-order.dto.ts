import { IsNumber, IsObject, IsString } from "class-validator"



export class Address {
  @IsString()
   country: string

  @IsString()
   city: string

  @IsString()
   street: string
 }

export class UpdateOrderDto {
  @IsString()
   payment: string

   @IsObject()
   address: Address

   isSendTelegram?: boolean
 }