import { Controller, Get } from "@nestjs/common";

@Controller('auth')
export class AuthController {
  @Get("show")
  getHello(): string {
    return "bosta"
  }
}
  