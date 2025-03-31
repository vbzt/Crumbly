import { Module } from "@nestjs/common";
import { SalesController } from "./sales.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { SalesService } from "./sales.service";
import { AuthModule } from "src/auth/auth.module";
import { EmployeeModule } from "src/employee/employee.module";
import { StockModule } from "src/stock/stock.module";

@Module({
  imports: [PrismaModule, AuthModule, EmployeeModule, StockModule],
  providers: [SalesService],
  controllers: [SalesController],
})

export class SalesModule{ 
  
}