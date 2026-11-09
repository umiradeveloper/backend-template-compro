import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1794194993540 implements MigrationInterface {
    name = 'InitialSchema1794194993540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(120) NOT NULL, \`email\` varchar(160) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('superadmin', 'admin', 'editor') NOT NULL DEFAULT 'editor', \`avatar\` varchar(500) NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`lastLoginAt\` datetime NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blogs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(191) NOT NULL, \`status\` enum ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft', \`createdById\` int NULL, \`updatedById\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`publishedAt\` datetime NULL, \`coverImage\` varchar(500) NULL, \`galleryImg\` varchar(500) NULL, \`isFeatured\` tinyint NOT NULL DEFAULT 0, \`tags\` varchar(300) NULL, \`views\` int NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_7b18faaddd461656ff66f32e2d\` (\`slug\`), INDEX \`IDX_55d52365907068ea6cc68cd607\` (\`status\`), INDEX \`IDX_1740341f7bc83a22a003018eb9\` (\`publishedAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`blog_translations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`locale\` varchar(5) NOT NULL, \`title\` varchar(255) NOT NULL, \`metaTitle\` varchar(255) NULL, \`metaDescription\` varchar(500) NULL, \`blogId\` int NOT NULL, \`detail\` varchar(255) NULL, \`excerpt\` text NULL, \`content\` longtext NULL, UNIQUE INDEX \`IDX_77699178883f7574fa7c5cfcbf\` (\`blogId\`, \`locale\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`projects\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(191) NOT NULL, \`status\` enum ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft', \`createdById\` int NULL, \`updatedById\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`coverImage\` varchar(500) NULL, \`gallery\` json NULL, \`area\` varchar(120) NULL, \`website\` varchar(255) NULL, \`location\` varchar(160) NULL, \`client\` varchar(160) NULL, \`year\` varchar(20) NULL, \`projectStatus\` varchar(40) NULL, \`isFeatured\` tinyint NOT NULL DEFAULT 0, \`sortOrder\` int NOT NULL DEFAULT '0', UNIQUE INDEX \`IDX_96e045ab8b0271e5f5a91eae1e\` (\`slug\`), INDEX \`IDX_a27865a7be17886e3088f4a650\` (\`status\`), INDEX \`IDX_b60a97f0b35a53b0f862e72bf1\` (\`sortOrder\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`project_translations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`locale\` varchar(5) NOT NULL, \`title\` varchar(255) NOT NULL, \`metaTitle\` varchar(255) NULL, \`metaDescription\` varchar(500) NULL, \`projectId\` int NOT NULL, \`industry\` varchar(160) NULL, \`scopeOfWork\` json NULL, \`description\` text NULL, \`content\` longtext NULL, UNIQUE INDEX \`IDX_e4fbf82aa0a1bcf4e0fd7774e8\` (\`projectId\`, \`locale\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`careers\` (\`id\` int NOT NULL AUTO_INCREMENT, \`slug\` varchar(191) NOT NULL, \`status\` enum ('draft', 'published', 'archived') NOT NULL DEFAULT 'draft', \`createdById\` int NULL, \`updatedById\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`publishedAt\` datetime NULL, \`closingDate\` date NULL, \`department\` varchar(120) NULL, \`location\` varchar(160) NULL, \`employmentType\` varchar(40) NULL, \`applyEmail\` varchar(160) NULL, \`applyUrl\` varchar(500) NULL, \`coverImage\` varchar(500) NULL, \`galleryImg\` varchar(500) NULL, UNIQUE INDEX \`IDX_919062b6f34d921a0fe47ef46b\` (\`slug\`), INDEX \`IDX_424ca264248e8d005e816c1609\` (\`status\`), INDEX \`IDX_81db688f582c451e858289e485\` (\`publishedAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`career_translations\` (\`id\` int NOT NULL AUTO_INCREMENT, \`locale\` varchar(5) NOT NULL, \`title\` varchar(255) NOT NULL, \`metaTitle\` varchar(255) NULL, \`metaDescription\` varchar(500) NULL, \`careerId\` int NOT NULL, \`detail\` varchar(255) NULL, \`excerpt\` text NULL, \`content\` longtext NULL, UNIQUE INDEX \`IDX_e0c21f6097d02acfd0a25940af\` (\`careerId\`, \`locale\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`collection_items\` (\`id\` int NOT NULL AUTO_INCREMENT, \`collection\` varchar(64) NOT NULL, \`sortOrder\` int NOT NULL DEFAULT '0', \`isActive\` tinyint NOT NULL DEFAULT 1, \`data\` json NOT NULL, \`translations\` json NOT NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_0491bf1dec3cf564dc2eb16c00\` (\`collection\`, \`sortOrder\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`settings\` (\`key\` varchar(64) NOT NULL, \`data\` json NOT NULL, \`translations\` json NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`key\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`site_texts\` (\`id\` int NOT NULL AUTO_INCREMENT, \`locale\` varchar(5) NOT NULL, \`key\` varchar(191) NOT NULL, \`value\` text NOT NULL, \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_23fffc1ba93a88c4a4ed3392ac\` (\`locale\`, \`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`media\` (\`id\` int NOT NULL AUTO_INCREMENT, \`filename\` varchar(255) NOT NULL, \`originalName\` varchar(255) NOT NULL, \`mimeType\` varchar(120) NOT NULL, \`size\` int NOT NULL, \`path\` varchar(500) NOT NULL, \`folder\` varchar(60) NOT NULL DEFAULT 'general', \`alt\` varchar(255) NULL, \`uploadedById\` int NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_9354d2330f75fd47e8e7cfacec\` (\`mimeType\`), INDEX \`IDX_b7b8e2c7f523dba4b76da1abec\` (\`folder\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`inquiries\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(120) NOT NULL, \`email\` varchar(160) NOT NULL, \`phone\` varchar(40) NULL, \`company\` varchar(160) NULL, \`subject\` varchar(200) NULL, \`message\` text NOT NULL, \`status\` enum ('new', 'read', 'replied', 'archived') NOT NULL DEFAULT 'new', \`notes\` text NULL, \`source\` varchar(30) NULL, \`ip\` varchar(64) NULL, \`userAgent\` varchar(300) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_665a574a2c2a574762537fcf08\` (\`status\`), INDEX \`IDX_410d6b6d982821f6190125a8ae\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`activity_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` int NULL, \`userName\` varchar(120) NULL, \`action\` varchar(30) NOT NULL, \`entity\` varchar(60) NOT NULL, \`entityId\` varchar(60) NULL, \`description\` varchar(500) NULL, \`ip\` varchar(64) NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), INDEX \`IDX_597e6df96098895bf19d4b5ea4\` (\`userId\`), INDEX \`IDX_8eed7481365b6212e789053da2\` (\`entity\`), INDEX \`IDX_95355d75c728050aae956cf016\` (\`createdAt\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`blog_translations\` ADD CONSTRAINT \`FK_b0fc3999bb92b77499055c87475\` FOREIGN KEY (\`blogId\`) REFERENCES \`blogs\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`project_translations\` ADD CONSTRAINT \`FK_50131fd3d7f2c1148758ad7f4d0\` FOREIGN KEY (\`projectId\`) REFERENCES \`projects\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`career_translations\` ADD CONSTRAINT \`FK_135d0c95280dea64705a5b87c31\` FOREIGN KEY (\`careerId\`) REFERENCES \`careers\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`career_translations\` DROP FOREIGN KEY \`FK_135d0c95280dea64705a5b87c31\``);
        await queryRunner.query(`ALTER TABLE \`project_translations\` DROP FOREIGN KEY \`FK_50131fd3d7f2c1148758ad7f4d0\``);
        await queryRunner.query(`ALTER TABLE \`blog_translations\` DROP FOREIGN KEY \`FK_b0fc3999bb92b77499055c87475\``);
        await queryRunner.query(`DROP INDEX \`IDX_95355d75c728050aae956cf016\` ON \`activity_logs\``);
        await queryRunner.query(`DROP INDEX \`IDX_8eed7481365b6212e789053da2\` ON \`activity_logs\``);
        await queryRunner.query(`DROP INDEX \`IDX_597e6df96098895bf19d4b5ea4\` ON \`activity_logs\``);
        await queryRunner.query(`DROP TABLE \`activity_logs\``);
        await queryRunner.query(`DROP INDEX \`IDX_410d6b6d982821f6190125a8ae\` ON \`inquiries\``);
        await queryRunner.query(`DROP INDEX \`IDX_665a574a2c2a574762537fcf08\` ON \`inquiries\``);
        await queryRunner.query(`DROP TABLE \`inquiries\``);
        await queryRunner.query(`DROP INDEX \`IDX_b7b8e2c7f523dba4b76da1abec\` ON \`media\``);
        await queryRunner.query(`DROP INDEX \`IDX_9354d2330f75fd47e8e7cfacec\` ON \`media\``);
        await queryRunner.query(`DROP TABLE \`media\``);
        await queryRunner.query(`DROP INDEX \`IDX_23fffc1ba93a88c4a4ed3392ac\` ON \`site_texts\``);
        await queryRunner.query(`DROP TABLE \`site_texts\``);
        await queryRunner.query(`DROP TABLE \`settings\``);
        await queryRunner.query(`DROP INDEX \`IDX_0491bf1dec3cf564dc2eb16c00\` ON \`collection_items\``);
        await queryRunner.query(`DROP TABLE \`collection_items\``);
        await queryRunner.query(`DROP INDEX \`IDX_e0c21f6097d02acfd0a25940af\` ON \`career_translations\``);
        await queryRunner.query(`DROP TABLE \`career_translations\``);
        await queryRunner.query(`DROP INDEX \`IDX_81db688f582c451e858289e485\` ON \`careers\``);
        await queryRunner.query(`DROP INDEX \`IDX_424ca264248e8d005e816c1609\` ON \`careers\``);
        await queryRunner.query(`DROP INDEX \`IDX_919062b6f34d921a0fe47ef46b\` ON \`careers\``);
        await queryRunner.query(`DROP TABLE \`careers\``);
        await queryRunner.query(`DROP INDEX \`IDX_e4fbf82aa0a1bcf4e0fd7774e8\` ON \`project_translations\``);
        await queryRunner.query(`DROP TABLE \`project_translations\``);
        await queryRunner.query(`DROP INDEX \`IDX_b60a97f0b35a53b0f862e72bf1\` ON \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_a27865a7be17886e3088f4a650\` ON \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_96e045ab8b0271e5f5a91eae1e\` ON \`projects\``);
        await queryRunner.query(`DROP TABLE \`projects\``);
        await queryRunner.query(`DROP INDEX \`IDX_77699178883f7574fa7c5cfcbf\` ON \`blog_translations\``);
        await queryRunner.query(`DROP TABLE \`blog_translations\``);
        await queryRunner.query(`DROP INDEX \`IDX_1740341f7bc83a22a003018eb9\` ON \`blogs\``);
        await queryRunner.query(`DROP INDEX \`IDX_55d52365907068ea6cc68cd607\` ON \`blogs\``);
        await queryRunner.query(`DROP INDEX \`IDX_7b18faaddd461656ff66f32e2d\` ON \`blogs\``);
        await queryRunner.query(`DROP TABLE \`blogs\``);
        await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
        await queryRunner.query(`DROP TABLE \`users\``);
    }

}
