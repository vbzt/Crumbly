import { IsEmail, IsString, IsStrongPassword } from "class-validator"

export class AuthResetDTO{ 
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

  @IsString()
  @IsStrongPassword({
     minLength: 6,
     minSymbols: 1,
     minUppercase: 1,
     minLowercase: 0,
     minNumbers: 1
   })
  confirmPassword: string
}