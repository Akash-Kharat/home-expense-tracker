import { Module } from '@nestjs/common';
import { MonthLocksService } from './month-locks.service.js';
import { MonthLocksController } from './month-locks.controller.js';

@Module({
  controllers: [MonthLocksController],
  providers: [MonthLocksService],
  exports: [MonthLocksService],
})
export class MonthLocksModule {}
