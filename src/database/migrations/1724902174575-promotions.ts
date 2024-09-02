import { MigrationInterface, QueryRunner } from "typeorm";

export class Promotions1724902174575 implements MigrationInterface {
    name = 'Promotions1724902174575'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`promotion\` (\`id\` varchar(36) NOT NULL, \`name\` varchar(100) NOT NULL, \`sku\` varchar(100) NOT NULL, \`stock\` int NOT NULL, \`price\` float NOT NULL, \`image\` text NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`categoryId\` varchar(36) NULL, \`branchId\` varchar(36) NULL, UNIQUE INDEX \`IDX_fcb949ab63218412458292cd8d\` (\`sku\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`promotion_details\` (\`id\` varchar(36) NOT NULL, \`quantity\` int NOT NULL, \`productId\` varchar(36) NULL, \`promotion_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`promotion\` ADD CONSTRAINT \`FK_40980afb1f1d578f3f6d3cbe104\` FOREIGN KEY (\`categoryId\`) REFERENCES \`category\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`promotion\` ADD CONSTRAINT \`FK_1f6970afc51cf24dff2ad314d54\` FOREIGN KEY (\`branchId\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`promotion_details\` ADD CONSTRAINT \`FK_f74dc5db3e3c2a77cc4e4ec8c37\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`promotion_details\` ADD CONSTRAINT \`FK_a98d996ceb40f4271eda5c6aeba\` FOREIGN KEY (\`promotion_id\`) REFERENCES \`promotion\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`promotion_details\` DROP FOREIGN KEY \`FK_a98d996ceb40f4271eda5c6aeba\``);
        await queryRunner.query(`ALTER TABLE \`promotion_details\` DROP FOREIGN KEY \`FK_f74dc5db3e3c2a77cc4e4ec8c37\``);
        await queryRunner.query(`ALTER TABLE \`promotion\` DROP FOREIGN KEY \`FK_1f6970afc51cf24dff2ad314d54\``);
        await queryRunner.query(`ALTER TABLE \`promotion\` DROP FOREIGN KEY \`FK_40980afb1f1d578f3f6d3cbe104\``);
        await queryRunner.query(`DROP TABLE \`promotion_details\``);
        await queryRunner.query(`DROP INDEX \`IDX_fcb949ab63218412458292cd8d\` ON \`promotion\``);
        await queryRunner.query(`DROP TABLE \`promotion\``);
    }

}
