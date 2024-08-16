import { Product } from '../../products/entities/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Resupply } from './resupply.entity';

@Entity()
export class ResupplyDetails {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  cost: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'float' })
  total: number;

  @ManyToOne(() => Product, { nullable: false, eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Resupply, (resupply) => resupply.products, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'resupply_id' })
  resupply: Resupply;

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
