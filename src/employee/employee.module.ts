import { Module } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [EmployeeService]
})

export class EmployeeModule {}