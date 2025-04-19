import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { EmployeeModule } from './employee/employee.module';
import { StockModule } from './stock/stock.module';
import { ConfigModule } from '@nestjs/config';

import * as path from 'path';
import { SalesModule } from './sales/sales.module'
import { ResendModule } from 'nest-resend';
import { TabModule } from './tabs/tab.module';

const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}


@Module({
  imports: [
    ResendModule.forRoot({
      apiKey: resendApiKey,
    }),
    AuthModule,
    EmployeeModule,
    StockModule,
    SalesModule,
    TabModule,
  ],
})

export class AppModule {}
 