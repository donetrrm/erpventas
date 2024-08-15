import { User } from '../../users/entities/user.entity';
import { ProductBranch } from '../../products/entities/products-branch.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Sale } from '../../sales/entities/sale.entity';

@Entity()
export class Branch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'varchar', length: 100 })
  description: string;

  @OneToMany(() => ProductBranch, (productBranch) => productBranch.branch, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'branch_id' })
  productsBranch: ProductBranch[];

  @OneToMany(() => User, (user) => user.id, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'user_id' })
  users: User[];

  @OneToMany(() => Sale, (sale) => sale.branch, {
    eager: false,
  })
  @JoinColumn({ referencedColumnName: 'branch_id' })
  sales: Sale[];

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
  })
  createAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
  })
  updateAt: Date;
}
