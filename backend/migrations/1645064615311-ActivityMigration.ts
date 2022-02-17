import { MigrationInterface, QueryRunner } from 'typeorm';


export class ActivityMigration1645064615311 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activity_entity');
    const oldColumn = table.columns.find(col => col.name == 'content');
    const newColumn = oldColumn.clone();
    newColumn.name = 'content2';

    await queryRunner.changeColumn(table, oldColumn, newColumn);
    //await queryRunner.addColumn(table, new TableColumn({ type: 'json', name: 'content2', isNullable: true }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('activity_entity');
    const oldColumn = table.columns.find(col => col.name == 'content2');
    if (!oldColumn) return;
    const newColumn = oldColumn.clone();
    newColumn.name = 'content';

    await queryRunner.changeColumn(table, oldColumn, newColumn);
  }
}
