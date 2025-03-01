import { Module } from "@nestjs/common";
import { StockService } from "./stock.service";
import { PrismaModule } from "src/prisma/prisma.module";
import { StockController } from "./stock.controller";

@Module({
  imports: [PrismaModule],
  providers: [StockService],
  controllers: [StockController]
})
export class StockModule{

}