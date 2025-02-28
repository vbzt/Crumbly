import { Controller, Get, Param, Post } from "@nestjs/common";

@Controller('/employees')
export class EmployeeController { 
  
  @Get('/')
  async showEmployees(){ 
    return ' '
  }

  @Get('/:id')
  async getEmployee(@Param() param: { id: string}){ 
    return param
  }

  @Post('/create')
  async createEmployee(@Param() param: {  }){ 

  }
}