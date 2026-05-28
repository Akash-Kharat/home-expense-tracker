import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AnalyticsService } from './analytics.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('analytics')
@UseGuards(JwtAuthGuard)
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Get('dashboard')
  getDashboard(
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: any,
  ) {
    return this.analyticsService.getDashboard(+month, +year, user.familyId);
  }

  @Get('category-trends')
  getCategoryTrends(
    @Query('year') year: string,
    @CurrentUser() user: any,
  ) {
    return this.analyticsService.getCategoryTrends(+year, user.familyId);
  }

  @Get('member-trends')
  getMemberTrends(
    @Query('year') year: string,
    @CurrentUser() user: any,
  ) {
    return this.analyticsService.getMemberTrends(+year, user.familyId);
  }

  @Get('budget-burn')
  getBudgetBurn(
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: any,
  ) {
    return this.analyticsService.getBudgetBurn(+month, +year, user.familyId);
  }
}
