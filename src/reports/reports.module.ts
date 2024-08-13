import { Module } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductBranch } from 'src/products/entities/products-branch.entity';
import { SaleDetails } from 'src/sales/entities/sale-details.entity';
import { Sale } from 'src/sales/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Sale,
    SaleDetails,
    ProductBranch
  ])],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
