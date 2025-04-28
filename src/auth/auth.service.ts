import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service"
import { Employee } from '@prisma/client'
import * as bcrypt from 'bcrypt' 
import { AuthLoginDTO } from "./dto/auth-login.dto"
import { JwtService } from "@nestjs/jwt"
import { AuthForgotDTO } from "./dto/auth-forgot.dto"
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { randomBytes } from "crypto";
import { AuthRegisterDTO } from "./dto/auth.register.dto";
import { EmployeeService } from "src/employee/employee.service";
import { InjectResend } from "nest-resend";
import { Resend } from 'resend'

@Injectable()
export class AuthService { 
  
  constructor(private readonly prismaService: PrismaService, private readonly JWTService: JwtService, @InjectResend() private readonly resendClient: Resend, private readonly employeeService: EmployeeService) { }

  async createToken( employee: Employee ){ 
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
    const token = await this.createToken(employee)
    return { ...token, message: "Employee registered successfully" }
    
  }

  async login(data: AuthLoginDTO){
    const employee = await this.prismaService.employee.findFirst( { where: { email: data.email }} )
    if(!employee) throw new UnauthorizedException('Incorrect email or password.') 

    const comparedPassword = await bcrypt.compare(data.password, employee.password)
    if(!comparedPassword) throw new UnauthorizedException('Incorrect email or password.') 

    const token = await this.createToken(employee)
    return { ...token, message: "Login successful" }
  }

  async forgotPassword(data: AuthForgotDTO){

    const employee = await this.prismaService.employee.findUnique( {where: { email: data.email } } )
    if(!employee) throw new NotFoundException('If the email')

    const manager = await this.prismaService.employee.findFirst( { where: { role: 'MANAGER' } } )
    if(!manager) throw new BadRequestException('Manager is not available right now, try again later!')

    const token = randomBytes(32).toString('hex')

    const expiresAt = new Date()
    expiresAt.setMinutes(expiresAt.getMinutes() + 15)

    await this.prismaService.resetPasswordToken.create({
      data: {
        token,
        employeeId: employee.id,
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


    
    const employee = await this.prismaService.employee.findUnique({ where: { id: payload.employeeId } })
    if (!employee) throw new NotFoundException('Employee does not exist')

    
    if(resetData.email !== employee.email) throw new UnauthorizedException('Email does not match the token')
    const hashedPassword = await bcrypt.hash( resetData.password, 10)
    employee.password = hashedPassword
  
    const updatedEmployee = await this.prismaService.employee.update( { where: { email: employee.email }, data: employee } )
    await this.prismaService.resetPasswordToken.update( { where: { token }, data: { used: true } } )
    return updatedEmployee
    
  }

  async sendPasswordResetEmail(managerEmail: string, token: string, employeeName: string) {
    const resetUrl = `http://localhost:3000/auth/reset/${token}`;
  
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Password Reset Request</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 15px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            border: 1px solid #e0e0e0;
          }
          .header {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 20px;
          }
          .content {
            font-size: 16px;
            line-height: 1.6;
            color: #555;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            margin-top: 25px;
            background-color: #28a745;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(40, 167, 69, 0.3);
            transition: background-color 0.3s ease;
          }
          .button:hover {
            background-color: #218838;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #999;
          }
          .footer a {
            color: #007bff;
            text-decoration: none;
          }
          .footer a:hover {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">Password Reset Request</div>
          <div class="content">
            <p>Hello, <strong>${employeeName}</strong> has requested to reset their password.</p>
            <p>Click the button below to confirm the reset:</p>
            <a class="button" href="${resetUrl}" target="_blank">Reset Password</a>
            <p>This link will expire in 15 minutes.</p>
          </div>
          <div class="footer">
            <p>&copy; 2025 <a href="https://github.com/vbzt" target="_blank">vbzt</a>. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    await this.resendClient.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: managerEmail,
      subject: `Password reset confirmation for ${employeeName}`,
      html,
    });
  }

}