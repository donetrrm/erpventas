import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Product } from './product.entity';
import { Branch } from '../../branches/entities/branch.entity';

@Entity({ name: 'products_branch' })
export class ProductBranch {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  public productId: string;

  @Column({ name: 'branch_id' })
  public branchId: string;
  @Column({ type: 'text', name: 'product_expiration' })
  expiration: string;

  @Column()
  public stock: number;

  @Column()
  public price: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => Product, (product) => product.productsBranch, {
    eager: true,
  })
  @JoinColumn({ name: 'product_id' })
  public product: Product;

  @ManyToOne(() => Branch, (branch) => branch.productsBranch)
  @JoinColumn({ name: 'branch_id' })
  public branch: Branch;
}
