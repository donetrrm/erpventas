import { Module, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBranch } from 'src/products/entities/products-branch.entity';
import { SaleDetails } from 'src/sales/entities/sale-details.entity';
import { Sale } from 'src/sales/entities/sale.entity';
import { Resupply } from 'src/branches/entities/resupply.entity';
import { CashWithdrawal } from 'src/sales/entities/cash-withdrawal.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sale,
      SaleDetails,
      ProductBranch,
      Resupply,
      CashWithdrawal,
    ]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
