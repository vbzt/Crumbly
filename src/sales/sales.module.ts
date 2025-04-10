import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { SalesController } from "./sales.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { SalesService } from "./sales.service";
import { AuthModule } from "src/auth/auth.module";
import { EmployeeModule } from "src/employee/employee.module";
import { IdCheckMiddleware } from "src/middlewares/check-id.middleware";
import { ItemIdCheckMiddleware } from "src/middlewares/check-item-id.middleware";

@Module({
  imports: [PrismaModule, AuthModule, EmployeeModule],
  providers: [SalesService],
  controllers: [SalesController],
})

export class SalesModule implements NestModule{ 
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdCheckMiddleware).forRoutes({
      path: 'sales/:id',
      method: RequestMethod.ALL
    })
    consumer.apply(ItemIdCheckMiddleware).forRoutes({
      path: 'sales/:id/items/:itemId',
      method: RequestMethod.ALL
    })
  }
}