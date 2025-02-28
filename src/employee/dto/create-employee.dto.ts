import { IsEmail, IsEnum, IsString, IsStrongPassword } from "class-validator"
import { Role } from "src/enum/role.enum"


export class CreateEmployeeDTO{ 

  @IsString()
  name: string

  @IsString()
  phone: string

  @IsEmail()
  email:string

  @IsEnum(Role)
  role: string

  @IsStrongPassword({
    minLength: 6,
    minSymbols: 1,
    minUppercase: 1,
    minLowercase: 0,
    minNumbers: 1
  })
  password: string

}