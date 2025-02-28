import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';

@Module({
  imports: [AuthModule, EmployeeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
