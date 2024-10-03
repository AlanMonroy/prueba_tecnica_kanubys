import {Model, DataTypes } from 'sequelize';
import sequelize from '../database';

// Define el modelo User
class Users extends Model {
  public id!: number;
  public username!: string;
  public password!: string;
  public email!: string;
}

Users.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    defaultValue: false,
  },
}, {
  sequelize,
  tableName: 'users',
});

export default Users;