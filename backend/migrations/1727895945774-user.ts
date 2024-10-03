import { MigrationInterface, QueryRunner, Table } from "typeorm";
export class User1727895945774 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'user',
                columns: [
                    {
                        name: 'sub',
                        type: 'varchar',
                        isPrimary: true,
                        isUnique: true,
                    },
                    {
                        name: 'email',
                        type: 'varchar',
                    },
                    {
                        name: 'encryptedMnemonic',
                        type: 'varchar',
                    },
                    {
                        name: 'publicKey',
                        type: 'varchar',
                    },
                    {
                        name: 'address',
                        type: 'varchar',
                    },
                ],
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('user');
    }

}
