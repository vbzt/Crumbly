import { IsStrongPassword } from "class-validator";
import { CreateEmployeeDTO } from "src/employee/dto/create-employee.dto";

export class AuthRegisterDTO extends CreateEmployeeDTO{ 

  @IsStrongPassword({
      minLength: 6,
      minSymbols: 1,
      minUppercase: 1,
      minLowercase: 0,
      minNumbers: 1
    })
  confirmPassword: string
}