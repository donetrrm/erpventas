import { Module } from '@nestjs/common';
import { SalesService } from './services/sales.service';
import { SalesController } from './controllers/sales.controller';
import { Product } from 'src/products/entities/product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { User } from 'src/users/entities/user.entity';
import { SaleDetails } from './entities/sale-details.entity';
import { Sale } from './entities/sale.entity';
import { ProductBranch } from 'src/products/entities/products-branch.entity';
import { BranchCash } from './entities/branch-cash.entity';
import { CashStart } from './entities/cash-start.entity';
import { CashWithdrawal } from './entities/cash-withdrawal.entity';
import { Promotion } from 'src/promotions/entities/promotion.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Branch,
      Product,
      Sale,
      SaleDetails,
      ProductBranch,
      BranchCash,
      CashStart,
      CashWithdrawal,
      Promotion,
    ]),
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
