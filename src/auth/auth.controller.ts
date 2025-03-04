import { Body, Controller, Get, Post } from "@nestjs/common";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthService } from "./auth.service";

@Controller('auth')
export class AuthController {

  constructor( private readonly authService: AuthService){ }
  
  @Post('login')
  async login(@Body() data: AuthLoginDTO){
    return this.authService.login(data)
  }

}
  