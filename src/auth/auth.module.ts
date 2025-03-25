import { Module } from "@nestjs/common"
import { AuthController } from "./auth.controller";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthService } from "./auth.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { JwtModule } from "@nestjs/jwt";
import * as dotenv from 'dotenv';
dotenv.config()



@Module({
  imports: [PrismaModule, JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [AuthController],
  providers:[AuthService],
  exports: [AuthService]
})
export class AuthModule {}
