import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CryptoTransactions1728282681938 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "CryptoTransactions",
                columns: [
                    {
                        name: "id",
                        type: "varchar",
                        isPrimary: true,
                        isUnique: true,
                        isNullable: false
                    },
                    {
                        name: "sub",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "to",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "amount",
                        type: "varchar",
                        isNullable: false
                    },
                    {
                        name: "status",
                        type: "enum",
                        enum: ['enqueued', 'failed', 'succeeded'],
                        default: `'enqueued'`, // Set the default value for status
                        isNullable: false
                    },
                    {
                        name: "createdAt",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "updatedAt",
                        type: "timestamp",
                        default: "now()",
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('CryptoTransactions');
    }

}
