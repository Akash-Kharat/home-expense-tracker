import { Controller, Post, Get, Body, Query, UseGuards } from '@nestjs/common';
import { MonthLocksService } from './month-locks.service.js';
import { MonthLockDto } from './dto/month-lock.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('months')
@UseGuards(JwtAuthGuard)
export class MonthLocksController {
  constructor(private monthLocksService: MonthLocksService) {}

  @Post('lock')
  lock(@Body() monthLockDto: MonthLockDto, @CurrentUser() user: any) {
    return this.monthLocksService.lock(
      monthLockDto.month,
      monthLockDto.year,
      user.familyId,
    );
  }

  @Post('unlock')
  unlock(@Body() monthLockDto: MonthLockDto, @CurrentUser() user: any) {
    return this.monthLocksService.unlock(
      monthLockDto.month,
      monthLockDto.year,
      user.familyId,
    );
  }

  @Get('status')
  getStatus(
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: any,
  ) {
    return this.monthLocksService.getStatus(+month, +year, user.familyId);
  }
}
