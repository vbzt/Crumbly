import { Body, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import * as bcrypt from 'bcrypt'
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";

@Injectable()
export class EmployeeService{
   constructor(private readonly prisma: PrismaService) { }

  async createEmployee(data: CreateEmployeeDTO){
    const existingEmployee = await this.prisma.employee.findFirst( { where: { OR: [ {  email: data.email }, { phone: data.phone } ] } })
    if(existingEmployee) throw new ConflictException('Employee already registered.')
    const salt = await bcrypt.genSalt()
    data.password = await bcrypt.hash(data.password, salt)
    return this.prisma.employee.create( { data })
  }

  async updateEmployee(id: number, data: UpdateEmployeeDTO){
    await this.employeeExists(id)
    if(data.password){
      const salt = await bcrypt.genSalt()
      data.password = await bcrypt.hash(data.password, salt)
    }
    return this.prisma.employee.update( { data, where: { id }, select: { id: true, name: true, email: true, phone: true, role: true } } )
  }

  async showEmployees(){ 
    return this.prisma.employee.findMany( { select: { id: true, name: true, email: true, phone: true, role: true }})
  }

  async getEmployee(id: number){
    await this.employeeExists(id)
    return await this.prisma.employee.findUnique( { where: {id}, select: { id: true, name: true, email: true, phone: true, role: true } } )
  }

  async deleteEmployee(id:number){
    await this.employeeExists(id)
    return await this.prisma.employee.delete( { where: {id} })
  }

  async employeeExists(id: number){ 
    if(!(await this.prisma.employee.count({ where: { id } }))){
      throw new NotFoundException('Employee do not exist')
    }
  }
}