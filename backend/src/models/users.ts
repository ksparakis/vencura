import {Entity, Column, PrimaryColumn, BaseEntity, Unique} from "typeorm"

@Entity()
@Unique(['sub'])
export class User extends BaseEntity {

    @PrimaryColumn()
    sub: string

    @Column()
    email: string

    @Column()
    encryptedMnemonic: string

    @Column()
    publicKey: string

    @Column()
    address: string

    @Column({ nullable: true })
    passwordEncryptionPvtKey?: string

    @Column()
    selectedNetwork: string
}
