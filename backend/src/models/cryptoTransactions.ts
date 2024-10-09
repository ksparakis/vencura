import {Entity, Column, PrimaryColumn, BaseEntity} from "typeorm"
import {CryptoTransactionStatus} from "../types/shared-types";

export enum CryptoTransactionStatusEnum {
    ENQUEUED = 'enqueued',
    FAILED = 'failed',
    SUCCEEDED = 'succeeded',
}

@Entity('CryptoTransactions')
export class CryptoTransactions extends BaseEntity {

    @PrimaryColumn()
    id: string

    @Column()
    sub: string

    @Column()
    to: string

    @Column()
    amount: string

    @Column({
        type: 'enum',
        enum: CryptoTransactionStatusEnum, // Use the TypeScript enum
        default: CryptoTransactionStatusEnum.ENQUEUED, // Set a default value if needed
    })
    status: CryptoTransactionStatus;

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
    })
    createdAt: Date

    @Column({
        type: 'timestamp',
        default: () => 'CURRENT_TIMESTAMP',
        onUpdate: 'CURRENT_TIMESTAMP',
    })
    updatedAt: Date
}
