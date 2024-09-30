import { Sequelize, DataTypes, Model, Optional } from 'sequelize';

interface UserAttributes {
    sub: string;
    email: string;
    encryptedMnemonic?: string;
    publicKey?: string;
    address?: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'encryptedMnemonic' | 'publicKey' | 'address'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
    public sub!: string;
    public email!: string;
    public encryptedMnemonic?: string;
    public publicKey?: string;
    public address?: string;

    // Timestamps
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
    public readonly deletedAt!: Date | null;
}

export default (sequelize: Sequelize): typeof User => {
    User.init(
        {
            sub: {
                type: DataTypes.UUID,
                primaryKey: true,
                allowNull: false,
                unique: true,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            encryptedMnemonic: {
                type: DataTypes.STRING,
            },
            publicKey: {
                type: DataTypes.STRING,
            },
            address: {
                type: DataTypes.STRING,
            },
        },
        {
            sequelize,
            modelName: 'User',
            paranoid: true,
            timestamps: true,
        }
    );
    return User;
};
