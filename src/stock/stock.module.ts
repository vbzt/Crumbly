import { Module } from "@nestjs/common";
import { StockService } from "./stock.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { StockController } from "./stock.controller";
import { AuthModule } from "src/auth/auth.module";
import { EmployeeModule } from "src/employee/employee.module";

@Module({
  imports: [PrismaModule, AuthModule, EmployeeModule],
  providers: [StockService],
  controllers: [StockController],
  exports: [StockService]
})
export class StockModule{

}