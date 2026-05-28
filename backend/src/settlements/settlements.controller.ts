import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  UseGuards,
  Query,
  Body,
} from '@nestjs/common';
import { SettlementsService } from './settlements.service.js';
import { GenerateSettlementDto } from './dto/generate-settlement.dto.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';

@Controller('settlements')
@UseGuards(JwtAuthGuard)
export class SettlementsController {
  constructor(private settlementsService: SettlementsService) {}

  @Post('generate')
  generate(
    @Body() generateDto: GenerateSettlementDto,
    @CurrentUser() user: any,
  ) {
    return this.settlementsService.generate(
      generateDto.month,
      generateDto.year,
      user.familyId,
    );
  }

  @Get()
  findAll(
    @Query('month') month: string,
    @Query('year') year: string,
    @CurrentUser() user: any,
  ) {
    return this.settlementsService.findAll(+month, +year, user.familyId);
  }

  @Patch(':id/settled')
  markSettled(@Param('id') id: string, @CurrentUser() user: any) {
    return this.settlementsService.markSettled(id, user.familyId);
  }
}
