import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import { ParamId } from "src/decorators/param.id.decorator";
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";

@Controller('/employees')
export class EmployeeController { 

  constructor ( private readonly employeeService: EmployeeService) {}
  
  @Get( )
  async showEmployees(){ 
    return this.employeeService.showEmployees()
  }

  @Get('/:id')
  async getEmployee(@ParamId() id: number){ 
    return this.employeeService.getEmployee(id)
  }

  @Post()
  async createEmployee(@Body() data: CreateEmployeeDTO){ 
    return this.employeeService.createEmployee(data)
  }

  @Patch('/:id')
  async updatePartial( @ParamId() id: number, @Body() data: UpdateEmployeeDTO){
    return this.employeeService.updateEmployee(id, data)
  }

  @Delete('/:id')
  async deleteEmployee(@ParamId() id: number){
    return this.employeeService.deleteEmployee(id)
  }
}