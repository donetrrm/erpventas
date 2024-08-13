import { MigrationInterface, QueryRunner } from "typeorm";

export class Resupply1721863102060 implements MigrationInterface {
    name = 'Resupply1721863102060'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`resupply\` (\`id\` varchar(36) NOT NULL, \`totalCost\` float NOT NULL, \`productQuantity\` float NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`user_id\` varchar(36) NOT NULL, \`branch_id\` varchar(36) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`resupply_details\` (\`id\` varchar(36) NOT NULL, \`cost\` float NOT NULL, \`quantity\` int NOT NULL, \`total\` float NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`product_id\` varchar(36) NOT NULL, \`resupply_id\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`resupply\` ADD CONSTRAINT \`FK_3342445a45ea0f236d8e3affc08\` FOREIGN KEY (\`user_id\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`resupply\` ADD CONSTRAINT \`FK_8a3414ad2617e8765906a049cb5\` FOREIGN KEY (\`branch_id\`) REFERENCES \`branch\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`resupply_details\` ADD CONSTRAINT \`FK_c5e81048e5b0a38eca636117581\` FOREIGN KEY (\`product_id\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`resupply_details\` ADD CONSTRAINT \`FK_51587ee4e2de590b90b1bc90a09\` FOREIGN KEY (\`resupply_id\`) REFERENCES \`resupply\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`resupply_details\` DROP FOREIGN KEY \`FK_51587ee4e2de590b90b1bc90a09\``);
        await queryRunner.query(`ALTER TABLE \`resupply_details\` DROP FOREIGN KEY \`FK_c5e81048e5b0a38eca636117581\``);
        await queryRunner.query(`ALTER TABLE \`resupply\` DROP FOREIGN KEY \`FK_8a3414ad2617e8765906a049cb5\``);
        await queryRunner.query(`ALTER TABLE \`resupply\` DROP FOREIGN KEY \`FK_3342445a45ea0f236d8e3affc08\``);
        await queryRunner.query(`DROP TABLE \`resupply_details\``);
        await queryRunner.query(`DROP TABLE \`resupply\``);
    }

}
