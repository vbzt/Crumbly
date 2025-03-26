import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service"
import { employees } from '@prisma/client'
import * as bcrypt from 'bcrypt' 
import { AuthLoginDTO } from "./dto/auth-login.dto"
import { JwtService } from "@nestjs/jwt"
import { AuthForgotDTO } from "./dto/auth-forgot.dto"
import { MailerService } from "@nestjs-modules/mailer";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { randomBytes } from "crypto";
import { AuthRegisterDTO } from "./dto/auth.register.dto";
import { EmployeeService } from "src/employee/employee.service";

@Injectable()
export class AuthService { 
  
  constructor(private readonly prismaService: PrismaService, private readonly JWTService: JwtService, private readonly mailerService: MailerService, private readonly employeeService: EmployeeService) { }

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

  async checkToken( token: string, expectedAudience: string | undefined ){ 

    try {
      const employeeInfo = this.JWTService.verify( token, { audience: expectedAudience, issuer: 'login' } ) 
      return employeeInfo
    } 
    catch (e) {
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

  async register(data: AuthRegisterDTO){ 
    if(data.password !== data.confirmPassword) throw new BadRequestException('Passwords must match.')
    const { confirmPassword, ...employeeData} = data
    const employee = await this.employeeService.createEmployee(employeeData)
    return this.createToken(employee)
    
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
    if(!employee) throw new NotFoundException('If the email')

    const manager = await this.prismaService.employees.findFirst( { where: { role: 'MANAGER' } } )
    if(!manager) throw new BadRequestException('Manager is not available right now, try again later!')

    const token = randomBytes(32).toString('hex')

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    await this.prismaService.resetPasswordToken.create({
      data: {
        token,
        employee_id: employee.id,
        expiresAt: expiresAt,
        used: false
      }
    })
    await this.sendPasswordResetEmail(manager.email, token, employee.name)
    return { message: 'A confirmation email was sent to your manager. Wait until their approval.' }
  }

  async resetPassword(token: string, resetData: AuthResetDTO){ 
   
    if(resetData.password !== resetData.confirmPassword){
      throw new BadRequestException('Passwords do not match')
    }

    const payload = await this.prismaService.resetPasswordToken.findUnique( { where: { token } } )
    if(!payload) throw new BadRequestException('Invalid token')
    if(new Date() > payload.expiresAt) throw new BadRequestException('Invalid token')
    if(payload.used) throw new BadRequestException('Invalid token')


    
    const employee = await this.prismaService.employees.findUnique({ where: { id: payload.employee_id } })
    if (!employee) throw new NotFoundException('Employee does not exist')

    
    if(resetData.email !== employee.email) throw new UnauthorizedException('Email does not match the token')
    const hashedPassword = await bcrypt.hash( resetData.password, 10)
    employee.password = hashedPassword
  
    const updatedEmployee = await this.prismaService.employees.update( { where: { email: employee.email }, data: employee } )
    await this.prismaService.resetPasswordToken.update( { where: { token }, data: { used: true } } )
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