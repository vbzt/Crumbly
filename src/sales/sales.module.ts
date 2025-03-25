import { Module } from "@nestjs/common";
import { SalesController } from "./sales.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { SalesService } from "./sales.service";

@Module({
  imports: [PrismaModule],
  providers: [SalesService],
  controllers: [SalesController] 
})

export class SalesModule{ 
  
}