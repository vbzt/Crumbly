import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { IdCheckMiddleware } from "src/middlewares/check-id.middleware";

@Module({
  imports: [PrismaModule],
  providers: [EmployeeService],
  controllers: [EmployeeController],
  exports: [EmployeeService]
})

export class EmployeeModule implements NestModule{

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdCheckMiddleware).forRoutes({
      path: 'employees/:id',
      method: RequestMethod.ALL
    }
      
    )
  }
}