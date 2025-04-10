import { MiddlewareConsumer, Module, NestModule, RequestMethod, forwardRef } from "@nestjs/common";
import { EmployeeService } from "./employee.service";
import { EmployeeController } from "./employee.controller";
import { PrismaModule } from "src/prisma/prisma.module";
import { IdCheckMiddleware } from "src/middlewares/check-id.middleware";
import { AuthModule } from "src/auth/auth.module";

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule)],
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