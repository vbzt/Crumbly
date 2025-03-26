import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthService } from "./auth.service";
import { AuthForgotDTO } from "./dto/auth-forgot.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { AuthRegisterDTO } from "./dto/auth.register.dto";

@Controller('auth')
export class AuthController {

  constructor( private readonly authService: AuthService){ }

  @Post('register')
  async register(@Body() data: AuthRegisterDTO){
    return this.authService.register(data)
  }

  @Post('login')
  async login(@Body() data: AuthLoginDTO){
    return this.authService.login(data)
  }

  @Post('forgot')
  async forgot(@Body() data:  AuthForgotDTO){
    return this.authService.forgotPassword(data)
  }

  @Post('reset/:token')
  async reset(@Param() { token }, @Body() data: AuthResetDTO){ 
    return this.authService.resetPassword(token, data)
  }
}
  