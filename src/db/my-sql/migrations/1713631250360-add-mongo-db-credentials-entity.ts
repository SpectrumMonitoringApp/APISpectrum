import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMongoDbCredentialsEntity1713631250360 implements MigrationInterface {
    name = 'AddMongoDbCredentialsEntity1713631250360'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`MongoDbCredentials\` (\`id\` int NOT NULL AUTO_INCREMENT, \`resourceId\` int NOT NULL, \`uri\` varchar(255) NOT NULL, \`databaseName\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`MongoDbCredentials\``);
    }

}
