import { MigrationInterface, QueryRunner } from "typeorm";

export class InitProd1712867681192 implements MigrationInterface {
    name = 'InitProd1712867681192'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`Workspace\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`User\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`fullName\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_4a257d2c9837248d70640b3e36\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ResourceUser\` (\`id\` int NOT NULL AUTO_INCREMENT, \`resourceId\` int NOT NULL, \`userId\` int NOT NULL, \`role\` enum ('admin', 'viewer') NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`DataStore\` (\`id\` int NOT NULL AUTO_INCREMENT, \`resourceId\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`Resource\` (\`id\` int NOT NULL AUTO_INCREMENT, \`workspaceId\` int NOT NULL, \`name\` varchar(255) NOT NULL, \`type\` enum ('mySql', 'mongoDb', 's3') NOT NULL, \`isActive\` tinyint NOT NULL, \`pollInterval\` int NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`MySqlCredentials\` (\`id\` int NOT NULL AUTO_INCREMENT, \`resourceId\` int NOT NULL, \`host\` varchar(255) NOT NULL, \`port\` varchar(255) NOT NULL, \`username\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`databaseName\` varchar(255) NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`WorkspaceMapping\` (\`principalId\` int NOT NULL, \`workspaceId\` int NOT NULL, INDEX \`IDX_f1b79a028e0b73a789b5e0b6cd\` (\`principalId\`), INDEX \`IDX_398f23d35778b7e5b096d08377\` (\`workspaceId\`), PRIMARY KEY (\`principalId\`, \`workspaceId\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`ResourceUser\` ADD CONSTRAINT \`FK_aa24d6ccff15244ec1342856470\` FOREIGN KEY (\`resourceId\`) REFERENCES \`Resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`DataStore\` ADD CONSTRAINT \`FK_68cfbb29cdff0213f4b5286717e\` FOREIGN KEY (\`resourceId\`) REFERENCES \`Resource\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`WorkspaceMapping\` ADD CONSTRAINT \`FK_f1b79a028e0b73a789b5e0b6cd6\` FOREIGN KEY (\`principalId\`) REFERENCES \`User\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE \`WorkspaceMapping\` ADD CONSTRAINT \`FK_398f23d35778b7e5b096d083775\` FOREIGN KEY (\`workspaceId\`) REFERENCES \`Workspace\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`WorkspaceMapping\` DROP FOREIGN KEY \`FK_398f23d35778b7e5b096d083775\``);
        await queryRunner.query(`ALTER TABLE \`WorkspaceMapping\` DROP FOREIGN KEY \`FK_f1b79a028e0b73a789b5e0b6cd6\``);
        await queryRunner.query(`ALTER TABLE \`DataStore\` DROP FOREIGN KEY \`FK_68cfbb29cdff0213f4b5286717e\``);
        await queryRunner.query(`ALTER TABLE \`ResourceUser\` DROP FOREIGN KEY \`FK_aa24d6ccff15244ec1342856470\``);
        await queryRunner.query(`DROP INDEX \`IDX_398f23d35778b7e5b096d08377\` ON \`WorkspaceMapping\``);
        await queryRunner.query(`DROP INDEX \`IDX_f1b79a028e0b73a789b5e0b6cd\` ON \`WorkspaceMapping\``);
        await queryRunner.query(`DROP TABLE \`WorkspaceMapping\``);
        await queryRunner.query(`DROP TABLE \`MySqlCredentials\``);
        await queryRunner.query(`DROP TABLE \`Resource\``);
        await queryRunner.query(`DROP TABLE \`DataStore\``);
        await queryRunner.query(`DROP TABLE \`ResourceUser\``);
        await queryRunner.query(`DROP INDEX \`IDX_4a257d2c9837248d70640b3e36\` ON \`User\``);
        await queryRunner.query(`DROP TABLE \`User\``);
        await queryRunner.query(`DROP TABLE \`Workspace\``);
    }

}
