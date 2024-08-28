import { MigrationInterface, QueryRunner } from "typeorm";

export class WithdrawalTypeMethod1724786843711 implements MigrationInterface {
    name = 'WithdrawalTypeMethod1724786843711'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cash_withdrawal\` ADD \`type\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`cash_withdrawal\` ADD \`withdrawalMethod\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cash_withdrawal\` DROP COLUMN \`withdrawalMethod\``);
        await queryRunner.query(`ALTER TABLE \`cash_withdrawal\` DROP COLUMN \`type\``);
    }

}
