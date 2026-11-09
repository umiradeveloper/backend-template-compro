import { MigrationInterface, QueryRunner } from "typeorm";

export class MediaUpdatedAt1794205742474 implements MigrationInterface {
    name = 'MediaUpdatedAt1794205742474'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` ADD \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`media\` DROP COLUMN \`updatedAt\``);
    }

}
