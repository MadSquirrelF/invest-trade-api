import { IsEmail, IsString, MinLength } from "class-validator"

export class RegisterDto {
  @MinLength(3, {
    message: 'Email cannot be less than 3 characters!'
  })
  @IsEmail()
  email: string

  @MinLength(6, {
    message: 'Password cannot be less than 6 characters!'
  })
  @IsString()
  password: string

  @MinLength(6, {
    message: 'Password cannot be less than 6 characters!'
  })
  @IsString()
  submitPassword: string

  @MinLength(3, {
    message: 'Username cannot be less than 6 characters!'
  })
  @IsString()
  username: string
}

export class LoginDto {
  @IsEmail()
  email: string

  @MinLength(6, {
    message: 'Password cannot be less than 6 characters!'
  })
  @IsString()
  password: string
}