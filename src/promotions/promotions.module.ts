import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PromotionService } from './promotions.service';
import { PromotionController } from './promotions.controller';
import { Promotion } from './entities/promotion.entity';
import { PromotionDetails } from './entities/promotion-details.entity';
import { Branch } from 'src/branches/entities/branch.entity';
import { Category } from 'src/products/entities/category.entity';
import { ProductBranch } from 'src/products/entities/products-branch.entity';
import { Product } from 'src/products/entities/product.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Promotion,
      PromotionDetails,
      ProductBranch,
      Branch,
      Category,
      Product,
    ]),
  ],
  controllers: [PromotionController],
  providers: [PromotionService],
})
export class PromotionsModule {}
