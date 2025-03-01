import { Body, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import * as bcrypt from 'bcrypt'
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";

@Injectable()
export class EmployeeService{
   constructor(private readonly prisma: PrismaService) { }

  async createEmployee(data: CreateEmployeeDTO){
    const salt = await bcrypt.genSalt()
    data.password = await bcrypt.hash(data.password, salt)
    return this.prisma.employees.create( { data })
  }

  async updateEmployee(id: number, data: UpdateEmployeeDTO){
    await this.employeeExists(id)
    if(data.password){
      const salt = await bcrypt.genSalt()
      data.password = await bcrypt.hash(data.password, salt)
    }
    return this.prisma.employees.update( { data, where: { id }, select: { id: true, name: true, email: true, phone: true, role: true } } )
  }

  async showEmployees(){ 
    return this.prisma.employees.findMany( { select: { id: true, name: true, email: true, phone: true, role: true }})
  }

  async getEmployee(id: number){
    await this.employeeExists(id)
    return await this.prisma.employees.findUnique( { where: {id}, select: { id: true, name: true, email: true, phone: true, role: true } } )
  }

  async deleteEmployee(id:number){
    await this.employeeExists(id)
    return await this.prisma.employees.delete( { where: {id} })
  }

  async employeeExists(id: number){ 
    if(!(await this.prisma.employees.count({ where: { id } }))){
      throw new NotFoundException('Employee do not exist')
    }
  }
}