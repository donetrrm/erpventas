import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Category } from './category.entity';
import { ProductBranch } from './products-branch.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 45 })
  sku: string;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'float' })
  cost: number;

  @Column({ type: 'text', name: 'image' })
  image: string;

  @Column({ type: 'text', name: 'product_expiration' })
  expiration: string;

  @ManyToOne(() => Category, (category) => category.product, {
    nullable: false,
    eager: true,
  })
  category: Category;

  @OneToMany(() => ProductBranch, (productBranch) => productBranch.product, {
    cascade: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ referencedColumnName: 'product_id' })
  productsBranch: ProductBranch[];

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
