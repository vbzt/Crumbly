import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';
import { EmployeeService } from './employee/employee.service';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe( { whitelist: true, forbidNonWhitelisted: true, transform: true}))

  await app.listen(process.env.PORT ?? 3000)
  const employeeService = app.get(EmployeeService)
  await employeeService.ensuremManagerEmployee()

}
bootstrap() 