import { Branch } from "../../branches/entities/branch.entity";
import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { SaleDetails } from "./sale-details.entity";

@Entity()
export class Sale {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float' })
    total: number;

    @Column({ type: 'varchar', length: 45 })
    paymentType: string;

    @ManyToOne(() => User, (user) => user.sales, {
        nullable: false,
        eager: true
      })
    @JoinColumn({ name: 'user_id' })
    user: User;
    
    @ManyToOne(() => Branch, (branch) => branch.sales, {
        nullable: false,
        eager: false
      })
    @JoinColumn({ name: 'branch_id' })
    branch: Branch;

    @OneToMany(() => SaleDetails, (saleDetails) => saleDetails.sale, {eager: true})
    products: SaleDetails[];

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

