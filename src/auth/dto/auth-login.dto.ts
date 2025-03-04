import { IsEmail, IsString, MinLength } from "class-validator"

export class AuthLoginDTO{ 
  @IsEmail()
  email: string

  @MinLength(6)
  @IsString()
  password: string
}