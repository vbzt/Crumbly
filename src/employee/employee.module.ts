import { Module } from "@nestjs/common";
import { EmployeeService } from "./employee.service";

@Module({
  imports: [],
  providers: [EmployeeService],
  controllers: [],
})

export class EmployeeModule {}