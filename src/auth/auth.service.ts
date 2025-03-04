import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { employees } from '@prisma/client'
import * as bcrypt from 'bcrypt' 
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService { 
  
  constructor(private readonly prismaService: PrismaService, private readonly JWTService: JwtService) { }

  async createToken( employee: employees ){ 
    return { 
      accessToken: this.JWTService.sign( 
        { 
          id: employee.id,
          name: employee.name,
          email: employee.email
        },
        {
          expiresIn: '7 days',
          subject: String(employee.id),
          issuer: 'login',
          audience: employee.role
        }
        
      )
    }
  }

  async checkToken( token: string, expectedAudience: string ){ 
    const employeeInfo = this.JWTService.verify( token, {
      audience: expectedAudience,
      issuer: 'login'
     }) 
    if(!employeeInfo) throw new BadRequestException('Invalid JWT')
    return employeeInfo
  }

  isValidToken(token: string, expectedAudience: string ){ 
    try {
      this.checkToken( token, expectedAudience )
      return true
    } catch (error) {
      return false 
    }
  }

  async login(data: AuthLoginDTO){
    const employee = await this.prismaService.employees.findFirst( { where: { email: data.email }} )
    if(!employee) throw new UnauthorizedException('Incorrect email or password.') 

    const comparedPassword = await bcrypt.compare(data.password, employee.password)
    if(!comparedPassword) throw new UnauthorizedException('Incorrect email or password.') 

    return this.createToken(employee)
  }

 
}