import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { MembersModule } from './members/members.module';
import { CategoriesModule } from './categories/categories.module';
import { BudgetsModule } from './budgets/budgets.module';
import { ExpensesModule } from './expenses/expenses.module';
import { SettlementsModule } from './settlements/settlements.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { MonthLocksModule } from './month-locks/month-locks.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { InvitationsModule } from './invitations/invitations.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    MembersModule,
    CategoriesModule,
    BudgetsModule,
    ExpensesModule,
    SettlementsModule,
    AnalyticsModule,
    MonthLocksModule,
    AuditLogsModule,
    InvitationsModule,
  ],
})
export class AppModule {}
