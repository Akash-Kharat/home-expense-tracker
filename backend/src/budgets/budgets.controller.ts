import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { BudgetsService } from './budgets.service.js';
import { CreateBudgetDto } from './dto/create-budget.dto.js';
import { UpdateBudgetDto } from './dto/update-budget.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('budgets')
@UseGuards(JwtAuthGuard)
export class BudgetsController {
  constructor(private budgetsService: BudgetsService) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto, @CurrentUser() user: any) {
    return this.budgetsService.create(createBudgetDto, user.familyId);
  }

  @Get('summary')
  getSummary(
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: any,
  ) {
    return this.budgetsService.getSummary(+month, +year, user.familyId);
  }

  @Get()
  findAll(
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: any,
  ) {
    return this.budgetsService.findAll(
      user.familyId,
      month ? +month : undefined,
      year ? +year : undefined,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: any) {
    return this.budgetsService.findOne(id, user.familyId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBudgetDto: UpdateBudgetDto,
    @CurrentUser() user: any,
  ) {
    return this.budgetsService.update(id, updateBudgetDto, user.familyId);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: any) {
    return this.budgetsService.remove(id, user.familyId);
  }
}
