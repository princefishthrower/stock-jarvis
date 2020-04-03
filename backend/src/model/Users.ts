import IUserSettings from "../../../shared/interfaces/IUserSettings";
import { Sequelize, Model, DataTypes } from "sequelize";

const sequelize = new Sequelize(
    process.env.STOCK_JARVIS_DATABASE_NAME_DEV || "",
    process.env.STOCK_JARVIS_DATABASE_USERNAME_DEV || "",
    process.env.STOCK_JARVIS_DATABASE_PASSWORD_DEV || "",
    {
        host: "localhost",
        dialect: "postgres"
    }
);

class Users extends Model {
    public id!: number;
    public email!: string;
    public token!: string;
    public settings!: IUserSettings;

    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

Users.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        token: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false
        },
        settings: {
            type: DataTypes.JSON,
            allowNull: false
        }
    },
    {
        sequelize,
        tableName: "users"
    }
);

export default Users;
