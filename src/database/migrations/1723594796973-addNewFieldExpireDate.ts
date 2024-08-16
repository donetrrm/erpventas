import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldExpireDate1723594796973 implements MigrationInterface {
    name = 'AddNewFieldExpireDate1723594796973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products_branch\` ADD \`product_expiration\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`product\` ADD \`product_expiration\` datetime NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product\` DROP COLUMN \`product_expiration\``);
        await queryRunner.query(`ALTER TABLE \`products_branch\` DROP COLUMN \`product_expiration\``);
    }

}
