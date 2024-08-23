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
export class CashStart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'float' })
  initialAmount: number;

  @ManyToOne(() => User, { eager: true })
  user: User;

  @ManyToOne(() => Branch, { eager: true })
  branch: Branch;

  @CreateDateColumn()
  date: Date;
}
