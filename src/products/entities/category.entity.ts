import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Product } from "./product.entity";

@Entity()
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    name: string;

    @Column({ type: 'varchar', length: 100 })
    description: string;

    @OneToMany(() => Product, (product) => product.category, { nullable: true })
    product: Product;

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

    @DeleteDateColumn({
        type: 'timestamp',
        name: 'deleted_at',
    })
    deleteAt: Date;
}
