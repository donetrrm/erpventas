import { MigrationInterface, QueryRunner } from "typeorm";

export class BranchCash1724288388942 implements MigrationInterface {
    name = 'BranchCash1724288388942'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`branch_cash\` (\`id\` varchar(36) NOT NULL, \`totalCash\` float NOT NULL DEFAULT '0', \`branch_id\` varchar(36) NULL, UNIQUE INDEX \`REL_b3fc33e7018098638d576f8d20\` (\`branch_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cash_start\` (\`id\` varchar(36) NOT NULL, \`initialAmount\` float NOT NULL, \`date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`branchId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`cash_withdrawal\` (\`id\` varchar(36) NOT NULL, \`amount\` float NOT NULL, \`concept\` varchar(255) NOT NULL, \`newTotal\` float NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`userId\` varchar(36) NULL, \`branchId\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`branch_cash\` ADD CONSTRAINT \`FK_b3fc33e7018098638d576f8d201\` FOREIGN KEY (\`branch_id\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cash_start\` ADD CONSTRAINT \`FK_64e4d83ca816f18eaf342dc887c\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cash_start\` ADD CONSTRAINT \`FK_03968b6b9051235f4a620858e76\` FOREIGN KEY (\`branchId\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cash_withdrawal\` ADD CONSTRAINT \`FK_88e9f91876859fe16c3aced8ba0\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`cash_withdrawal\` ADD CONSTRAINT \`FK_257cde7f22a0d2007f2e8fa69c6\` FOREIGN KEY (\`branchId\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`cash_withdrawal\` DROP FOREIGN KEY \`FK_257cde7f22a0d2007f2e8fa69c6\``);
        await queryRunner.query(`ALTER TABLE \`cash_withdrawal\` DROP FOREIGN KEY \`FK_88e9f91876859fe16c3aced8ba0\``);
        await queryRunner.query(`ALTER TABLE \`cash_start\` DROP FOREIGN KEY \`FK_03968b6b9051235f4a620858e76\``);
        await queryRunner.query(`ALTER TABLE \`cash_start\` DROP FOREIGN KEY \`FK_64e4d83ca816f18eaf342dc887c\``);
        await queryRunner.query(`ALTER TABLE \`branch_cash\` DROP FOREIGN KEY \`FK_b3fc33e7018098638d576f8d201\``);
        await queryRunner.query(`DROP TABLE \`cash_withdrawal\``);
        await queryRunner.query(`DROP TABLE \`cash_start\``);
        await queryRunner.query(`DROP INDEX \`REL_b3fc33e7018098638d576f8d20\` ON \`branch_cash\``);
        await queryRunner.query(`DROP TABLE \`branch_cash\``);
    }

}
