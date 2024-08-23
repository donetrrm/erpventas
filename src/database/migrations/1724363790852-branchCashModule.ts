import { MigrationInterface, QueryRunner } from "typeorm";

export class BranchCashModule1724363790852 implements MigrationInterface {
    name = 'BranchCashModule1724363790852'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`branch\` ADD \`branchCashId\` varchar(36) NULL`);
        await queryRunner.query(`ALTER TABLE \`branch\` ADD UNIQUE INDEX \`IDX_fb953531ceb4013efe92ca16a4\` (\`branchCashId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_fb953531ceb4013efe92ca16a4\` ON \`branch\` (\`branchCashId\`)`);
        await queryRunner.query(`ALTER TABLE \`branch\` ADD CONSTRAINT \`FK_fb953531ceb4013efe92ca16a41\` FOREIGN KEY (\`branchCashId\`) REFERENCES \`branch_cash\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`branch\` DROP FOREIGN KEY \`FK_fb953531ceb4013efe92ca16a41\``);
        await queryRunner.query(`DROP INDEX \`REL_fb953531ceb4013efe92ca16a4\` ON \`branch\``);
        await queryRunner.query(`ALTER TABLE \`branch\` DROP INDEX \`IDX_fb953531ceb4013efe92ca16a4\``);
        await queryRunner.query(`ALTER TABLE \`branch\` DROP COLUMN \`branchCashId\``);
    }

}
