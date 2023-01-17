import { IsEmail, IsString, MinLength } from "class-validator"

export class RegisterDto {
  @IsEmail()
  email: string
  @MinLength(6, {
    message: 'Password cannot be less than 6 characters!'
  })
  @IsString()
  password: string

  @IsString()
  username: string

  avatar?: string

  @IsString()
  sex: string

  phone_number?: string
}
export class LoginDto {
  @IsEmail()
  email: string
  @MinLength(6, {
    message: 'Password cannot be less than 6 characters!'
  })
  @IsString()
  password: string

  username?: string

  avatar?: string

  sex?: string

  phone_number?: string
}