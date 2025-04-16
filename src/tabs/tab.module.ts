import { Module } from "@nestjs/common";
import { TabController } from "./tab.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthModule } from "src/auth/auth.module";
import { EmployeeModule } from "src/employee/employee.module";
import { TabService } from "./tab.service";


@Module({
  imports: [PrismaModule, AuthModule, EmployeeModule],
  controllers: [TabController],
  providers: [TabService],
  exports: [],
})

export class CommandsModule {} 

