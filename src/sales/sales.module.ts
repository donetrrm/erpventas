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

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Branch,
    Product,
    Sale,
    SaleDetails,
    ProductBranch
  ])],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
