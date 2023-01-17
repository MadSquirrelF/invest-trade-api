import { IsEmail } from "class-validator"

export class UpdateUserDto {
  @IsEmail()
  email: string

  username?: string

  password?: string

  sex?: string

  avatar?: string

  phone_number?: string

  isAdmin?: boolean
}