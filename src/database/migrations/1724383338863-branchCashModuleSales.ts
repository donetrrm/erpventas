import { MigrationInterface, QueryRunner } from "typeorm";

export class BranchCashModuleSales1724383338863 implements MigrationInterface {
    name = 'BranchCashModuleSales1724383338863'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_fb953531ceb4013efe92ca16a41\``);
        await queryRunner.query(`DROP INDEX \`IDX_fb953531ceb4013efe92ca16a4\` ON \`branch\``);
        await queryRunner.query(`DROP INDEX \`REL_fb953531ceb4013efe92ca16a4\` ON \`branch\``);
        await queryRunner.query(`ALTER TABLE \`branch\` DROP COLUMN \`branchCashId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`branch\` ADD \`branchCashId\` varchar(36) NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_fb953531ceb4013efe92ca16a4\` ON \`branch\` (\`branchCashId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_fb953531ceb4013efe92ca16a4\` ON \`branch\` (\`branchCashId\`)`);
        await queryRunner.query(`ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_fb953531ceb4013efe92ca16a41\` FOREIGN KEY (\`branchCashId\`) REFERENCES \`branch_cash\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
