import {MigrationInterface, QueryRunner, TableColumn} from "typeorm";

export class AddMessageToCryptoTransactions1728579981726 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            'CryptoTransactions',
            new TableColumn({
                name: 'message',
                type: 'varchar',
                isNullable: true, // Set this to false if you want the field to be required
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('CryptoTransactions', 'message');
    }
}
