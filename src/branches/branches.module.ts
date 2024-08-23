import { Module } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { BranchesController } from './branches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './entities/branch.entity';
import { ProductBranch } from '../products/entities/products-branch.entity';
import { ProductsModule } from 'src/products/products.module';
import { User } from 'src/users/entities/user.entity';
import { BranchCash } from '../sales/entities/branch-cash.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, ProductBranch, User, BranchCash]),
    ProductsModule,
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [TypeOrmModule],
})
export class BranchesModule {}
