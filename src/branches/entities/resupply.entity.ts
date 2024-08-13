import { User } from "../../users/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Branch } from "./branch.entity";
import { ResupplyDetails } from "./resupply-details.entity";

@Entity()
export class Resupply {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'float' })
    totalCost: number;

    @Column({ type: 'float' })
    productQuantity: number;

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

    @OneToMany(() => ResupplyDetails, (resupplyDetails) => resupplyDetails.resupply, {eager: true})
    products: ResupplyDetails[];

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