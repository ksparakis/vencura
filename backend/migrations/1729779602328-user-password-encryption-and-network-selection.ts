import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class UserPasswordEncryptionAndNetworkSelection1729779602328 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns('user', [
            new TableColumn({
                name: 'passwordEncryptionPvtKey',
                type: 'varchar',
                isNullable: true, // Set to false if you don't want this field to be nullable
            }),
            new TableColumn({
                name: 'selectedNetwork',
                type: 'varchar',
                isNullable: false, // Ensure selectedNetwork is not nullable
                default: `'sepolia'` // Set the default value to 'sepolia'
            }),
        ]);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'passwordEncryptionPvtKey');
        await queryRunner.dropColumn('user', 'selectedNetwork');
    }

}
