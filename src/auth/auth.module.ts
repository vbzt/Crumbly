import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import * as dotenv from 'dotenv';
import { EmployeeModule } from "src/employee/employee.module";
dotenv.config()



@Module({
  imports: [EmployeeModule, PrismaModule, JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [AuthController],
  providers:[AuthService],
  exports: [AuthService]
})
export class AuthModule {}
