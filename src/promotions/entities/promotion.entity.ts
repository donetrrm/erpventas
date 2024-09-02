import { Branch } from '../../branches/entities/branch.entity';
import { Category } from '../../products/entities/category.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { PromotionDetails } from './promotion-details.entity';

@Entity()
export class Promotion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'text', name: 'image' })
  image: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @ManyToOne(() => Category, { eager: true })
  category: Category;

  @ManyToOne(() => Branch, { eager: true })
  branch: Branch;

  @OneToMany(
    () => PromotionDetails,
    (promotionDetails) => promotionDetails.promotion,
    {
      eager: true,
      cascade: true,
    },
  )
  promotionDetails: PromotionDetails[];
}
