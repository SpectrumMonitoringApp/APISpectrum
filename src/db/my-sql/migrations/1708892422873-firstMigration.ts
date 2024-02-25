import { MigrationInterface, QueryRunner } from "typeorm";

export class FirstMigration1708892422873 implements MigrationInterface {
    name = 'FirstMigration1708892422873'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`SELECT 2 + 2;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`SELECT 2 - 2;`);
    }

}
