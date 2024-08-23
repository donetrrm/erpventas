import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Branch } from '../../branches/entities/branch.entity';

@Entity()
export class CashWithdrawal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  amount: number;

  @Column()
  concept: string;

  @Column({ type: 'float' })
  newTotal: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Branch, { eager: true })
  branch: Branch;

  @CreateDateColumn()
  createdAt: Date;
}
