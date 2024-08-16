import { Module } from '@nestjs/common';
import { ResupplyService } from './services/resupply.service';
import { ResupplyController } from './controllers/resupply.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/branches/entities/branch.entity';
import { Resupply } from 'src/branches/entities/resupply.entity'; 
import { ResupplyDetails } from 'src/branches/entities/resupply-details.entity';
import { Product } from 'src/products/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import { ProductBranch } from 'src/products/entities/products-branch.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Branch,
      Resupply,
      ResupplyDetails,
      Product,
      ProductBranch,
    ]),
  ],
  controllers: [ResupplyController],
  providers: [ResupplyService],
  exports: [TypeOrmModule],
})
export class ResupplyModule {}
