import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { Branch } from '../../branches/entities/branch.entity';
import { Sale } from '../../sales/entities/sale.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 45 })
  name: string;

  @Column({ type: 'varchar', length: 45, name: 'last_name' })
  surnames: string;

  @Column({ type: 'varchar', length: 45, unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar' })
  password: string;

  @ManyToOne(() => Role, { nullable: false, eager: true })
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @ManyToOne(() => Branch, { nullable: true, eager: true })
  @JoinColumn({ name: 'branch_id' })
  branch: Branch;

  @Exclude()
  @OneToMany(() => Sale, (sale) => sale.user, {
    eager: false,
  })
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
