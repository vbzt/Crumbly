import { IsEmail} from "class-validator"

export class AuthForgotDTO{ 
  @IsEmail()
  email: string
}