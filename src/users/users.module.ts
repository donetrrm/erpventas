import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersController } from './controllers/users.controller';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleController } from './controllers/role.controller';
import { RoleService } from './services/role.service';
import { Branch } from 'src/branches/entities/branch.entity';
import { Sale } from 'src/sales/entities/sale.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    User,
    Role,
    Branch,
    Sale
  ]),],
  controllers: [UsersController,RoleController],
  providers: [UsersService,RoleService],
  exports: [UsersService],
})
export class UsersModule {}
