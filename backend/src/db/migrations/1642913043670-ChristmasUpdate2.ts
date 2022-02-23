import {MigrationInterface, QueryRunner} from "typeorm";

export class ChristmasUpdate21642913043670 implements MigrationInterface {
    name = 'ChristmasUpdate21642913043670'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "io_t_project_entity_iot_objects_io_t_object_entity" DROP CONSTRAINT "FK_9a06a7f3384daf840cb54ed3112"`);
        await queryRunner.query(`CREATE TABLE "commentaires_forum" ("id" SERIAL NOT NULL, "content" text NOT NULL, "created_at" character varying NOT NULL, "creatorId" uuid, "postId" integer, CONSTRAINT "PK_137f96b5989abfce4857d95e3a6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories_subject" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_691553bee15beac8713350a3863" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "subject" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "categoryId" integer, CONSTRAINT "PK_12eee115462e38d62e5455fc054" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "post" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "created_at" character varying NOT NULL, "creatorId" uuid, "subjectId" integer, CONSTRAINT "PK_be5fda3aac270b134ff9c21cdee" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories_quiz" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_c7b89a1e9f7fde9f4f45210192f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "value" character varying NOT NULL, "is_good" boolean NOT NULL DEFAULT false, "questionId" integer, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "quizId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "result" ("id" SERIAL NOT NULL, "percentage" integer NOT NULL DEFAULT '0', "userId" uuid, "quizId" integer, CONSTRAINT "PK_c93b145f3c2e95f6d9e21d188e2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "reward" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_a90ea606c229e380fb341838036" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" text NOT NULL, "userId" uuid, "rewardId" integer, "categoryId" integer, CONSTRAINT "REL_3507d97bf5eae279599048e648" UNIQUE ("rewardId"), CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "creationDate" TIMESTAMP NOT NULL DEFAULT now(), "updateDate" TIMESTAMP NOT NULL DEFAULT now(), "description" character varying, "content" character varying NOT NULL, "creatorId" uuid, "authorId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "course_history_entity" ("id" SERIAL NOT NULL, "lastInteraction" TIMESTAMP NOT NULL, "courseId" uuid, "userId" uuid, CONSTRAINT "PK_8c8c747776751f4616a2d05abd2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "topics" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_e4aa99a3fa60ec3a37d1fc4e853" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "io_t_project_entity" ADD "document" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "classroom_entity" ADD "access" character varying NOT NULL DEFAULT 'PR'`);
        await queryRunner.query(`ALTER TABLE "level_progression_entity" ADD CONSTRAINT "PK_bc112a0077ba8d4ea2e2bb42d6e" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "image" SET NOT NUVyLL`);
        await queryRunner.query(`DROP TABLE "topics"`);
        await queryRunner.query(`DROP TABLE "course_history_entity"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`ALTER TABLE "course_history_entity" DROP CONSTRAINT "FK_f86dbfe489c22dd3bae9fce239c"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_e04040c4ea7133eeddefff6417d"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_f71164a9a1804f8ba5351bcf437"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_3507d97bf5eae279599048e6482"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_52c158a608620611799fd63a927"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_ee18239cf6832f54ad345bb87e1"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_601be29c4bf75f59d0261f769ba"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_e1b114a8be985356d01aa1095ce"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "FK_f81beb44b6ad930bea914860601"`);
        await queryRunner.query(`ALTER TABLE "commentaires_forum" DROP CONSTRAINT "FK_54c5dd26b87c4bf548f2b2cd617"`);
        await queryRunner.query(`ALTER TABLE "commentaires_forum" DROP CONSTRAINT "FK_35f0cad0e3055836d3dbfe7e22b"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "image" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "level_progression_entity" DROP CONSTRAINT "PK_bc112a0077ba8d4ea2e2bb42d6e"`);
        await queryRunner.query(`ALTER TABLE "classroom_entity" DROP COLUMN "access"`);
        await queryRunner.query(`ALTER TABLE "io_t_project_entity" DROP COLUMN "document"`);
        await queryRunner.query(`DROP TABLE "topics"`);
        await queryRunner.query(`DROP TABLE "course_history_entity"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`ALTER TABLE "course_history_entity" DROP CONSTRAINT "FK_f86dbfe489c22dd3bae9fce239c"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c72d82fa0e8699a141ed6cc41b3"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_e04040c4ea7133eeddefff6417d"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_f71164a9a1804f8ba5351bcf437"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_3507d97bf5eae279599048e6482"`);
        await queryRunner.query(`ALTER TABLE "quiz" DROP CONSTRAINT "FK_52c158a608620611799fd63a927"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_ee18239cf6832f54ad345bb87e1"`);
        await queryRunner.query(`ALTER TABLE "result" DROP CONSTRAINT "FK_601be29c4bf75f59d0261f769ba"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_e1b114a8be985356d01aa1095ce"`);
        await queryRunner.query(`ALTER TABLE "post" DROP CONSTRAINT "FK_9e91e6a24261b66f53971d3f96b"`);
        await queryRunner.query(`ALTER TABLE "subject" DROP CONSTRAINT "FK_f81beb44b6ad930bea914860601"`);
        await queryRunner.query(`ALTER TABLE "commentaires_forum" DROP CONSTRAINT "FK_54c5dd26b87c4bf548f2b2cd617"`);
        await queryRunner.query(`ALTER TABLE "commentaires_forum" DROP CONSTRAINT "FK_35f0cad0e3055836d3dbfe7e22b"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "image" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "user_entity" ALTER COLUMN "image" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "level_progression_entity" DROP CONSTRAINT "PK_bc112a0077ba8d4ea2e2bb42d6e"`);
        await queryRunner.query(`ALTER TABLE "classroom_entity" DROP COLUMN "access"`);
        await queryRunner.query(`ALTER TABLE "io_t_project_entity" DROP COLUMN "document"`);
        await queryRunner.query(`DROP TABLE "topics"`);
        await queryRunner.query(`DROP TABLE "course_history_entity"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "quiz"`);
        await queryRunner.query(`DROP TABLE "reward"`);
        await queryRunner.query(`DROP TABLE "result"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "categories_quiz"`);
        await queryRunner.query(`DROP TABLE "post"`);
        await queryRunner.query(`DROP TABLE "subject"`);
        await queryRunner.query(`DROP TABLE "categories_subject"`);
        await queryRunner.query(`DROP TABLE "commentaires_forum"`);
        await queryRunner.query(`ALTER TABLE "io_t_project_entity_iot_objects_io_t_object_entity" ADD CONSTRAINT "FK_9a06a7f3384daf840cb54ed3112" FOREIGN KEY ("ioTObjectEntityId") REFERENCES "io_t_object_entity"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    public async down(queryRunner: QueryRunner) {
    }
}
