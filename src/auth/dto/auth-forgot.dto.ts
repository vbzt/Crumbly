import { IsEmail, IsString, IsStrongPassword } from "class-validator"

export class AuthForgotDTO{ 
  @IsEmail()
  email: string

  @IsString()
  @IsStrongPassword({
     minLength: 6,
     minSymbols: 1,
     minUppercase: 1,
     minLowercase: 0,
     minNumbers: 1
   })
  password: string
}