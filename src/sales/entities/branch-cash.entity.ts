import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Branch } from '../../branches/entities/branch.entity';

@Entity()
export class BranchCash {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Branch, (branch) => branch.branchCash)
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Column({ type: 'float', default: 0 })
  totalCash: number;
}
