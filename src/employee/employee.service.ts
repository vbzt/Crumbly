import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateEmployeeDTO } from "./dto/create-employee.dto";
import * as bcrypt from 'bcrypt'
import { UpdateEmployeeDTO } from "./dto/update-employee.dto";
import { RoleQueryDTO } from "./dto/role-query.dto";
import { error } from "console";

@Injectable()
export class EmployeeService{
   constructor(private readonly prismaService: PrismaService) { }

  async createEmployee(data: CreateEmployeeDTO){
    const existingEmployee = await this.prismaService.employee.findFirst( { where: { OR: [ {  email: data.email }, { phone: data.phone } ] } })
    if(existingEmployee) throw new ConflictException('Employee already registered.')

    if(data.role === 'MANAGER') throw new BadRequestException({ message: ["role must be one of the following values: CASHIER, STOCKER"], error: "Bad Request", statusCode: 400 })
    const salt = await bcrypt.genSalt()
    data.password = await bcrypt.hash(data.password, salt)
    return this.prismaService.employee.create( { data })
  }

  async updateEmployee(id: number, data: UpdateEmployeeDTO){
    await this.employeeExists(id)
    if(data.password){
      const salt = await bcrypt.genSalt()
      data.password = await bcrypt.hash(data.password, salt)
    }
    return this.prismaService.employee.update( { data, where: { id }, select: { id: true, name: true, email: true, phone: true, role: true } } )
  }

  async showEmployees(query: RoleQueryDTO){
    if(query.role) return this.prismaService.employee.findMany( { where: { role: query.role }, select: { id: true, name: true, email: true, phone: true, role: true }})
    return this.prismaService.employee.findMany( { select: { id: true, name: true, email: true, phone: true, role: true }})
  }

  async getEmployee(id: number){
    await this.employeeExists(id)
    return await this.prismaService.employee.findUnique( { where: {id}, select: { id: true, name: true, email: true, phone: true, role: true } } )
  }

  async deleteEmployee(id:number){
    await this.employeeExists(id)
    return await this.prismaService.employee.delete( { where: {id} })
  }

 employeeExists = async (id: number) => { 
    if(!(await this.prismaService.employee.count({ where: { id } }))){
      throw new NotFoundException('Employee do not exist')
    }
  }

  ensuremManagerEmployee = async () => { 
    const managerExists = await this.prismaService.employee.findFirst({ where: { role: 'MANAGER' }})
    if(!managerExists){
      const salt = await bcrypt.genSalt()
      const password = await bcrypt.hash('manager123', salt)
      
      await this.prismaService.employee.create({ data: { name: 'manager', email:'manager@crumbly.com', phone: '1199999999', password, role: 'MANAGER' }})
      console.log('✅ Base manager created >> manager@crumbly.com | manager123')
    }
  }
}