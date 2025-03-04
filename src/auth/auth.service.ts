import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service"
import { employees } from '@prisma/client'
import * as bcrypt from 'bcrypt' 
import { AuthLoginDTO } from "./dto/auth-login.dto"
import { JwtService } from "@nestjs/jwt"
import { AuthForgotDTO } from "./dto/auth-forgot.dto"
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class AuthService { 
  
  constructor(private readonly prismaService: PrismaService, private readonly JWTService: JwtService, private readonly mailerService: MailerService) { }

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

    try {
      const employeeInfo = this.JWTService.verify( token, { audience: expectedAudience, issuer: 'login' } ) 
      return employeeInfo
    } 
    catch (e) {
      throw new BadRequestException('Invalid JWT')
    }
  }

  async checkResetToken( token: string ){ 
    try {
      const employeeInfo = this.JWTService.verify( token, { audience: 'MANAGER', issuer: 'reset' } ) 
      return employeeInfo
    } 
    catch (e){ 
      throw new BadRequestException('Invalid JWT')
     }
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

  async forgotPassword(data: AuthForgotDTO){

    const employee = await this.prismaService.employees.findUnique( {where: { email: data.email } } )
    if(!employee) throw new NotFoundException('Employee do not exists')

    const manager = await this.prismaService.employees.findFirst( { where: { role: 'MANAGER' } } )
    if(!manager) throw new BadRequestException('Manager is not available right now, try again later!')

    const salt = await bcrypt.genSalt( 12 )
    data.password = await bcrypt.hash(data.password, salt)

    const token = this.JWTService.sign(
      { 
        email: data.email,
        newPassword: data.password
      },
      {
        expiresIn: '5m',
        subject: String(employee.id),
        issuer: 'reset',
        audience: 'MANAGER'
      }
    )

    await this.sendPasswordResetEmail(manager.email, token, employee.name)
  }

  async resetPassword(token: string){ 
    await this.checkResetToken(token)

    const employeeInfo = await this.checkResetToken(token)
    const employee = await this.prismaService.employees.findUnique( { where: {email: employeeInfo.email }})
    if(!employee) throw new NotFoundException('Employee do not exists')
    employee.password = employeeInfo.newPassword
  
    const updatedEmployee = await this.prismaService.employees.update( { where: { email: employee.email }, data: employee } )
    return updatedEmployee
    
  }



  async sendPasswordResetEmail(managerEmail: string, token: string, employeeName: string) {
    const resetUrl = `http://localhost:3000/auth/reset/${token}`;
    await this.mailerService.sendMail({
      to: managerEmail,
      subject: `Password reset confirmation for ${employeeName}`,
      template: './reset',
      context: {
        employeeName,
        resetUrl,
      },
    })

  }

}