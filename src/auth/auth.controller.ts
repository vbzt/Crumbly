import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthService } from "./auth.service";
import { AuthForgotDTO } from "./dto/auth-forgot.dto";

@Controller('auth')
export class AuthController {

  constructor( private readonly authService: AuthService){ }
  
  @Post('login')
  async login(@Body() data: AuthLoginDTO){
    return this.authService.login(data)
  }

  @Post('forgot')
  async forgot(@Body() data: AuthForgotDTO){
    return this.authService.forgotPassword(data)
  }

  @Get('reset/:token')
  async reset(@Param() { token }){ 
    return this.authService.resetPassword(token)
  }
}
  