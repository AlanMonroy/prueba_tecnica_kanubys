import {Model, DataTypes } from 'sequelize';
import sequelize from '../database';

// Define el modelo Task
class Task extends Model {
  public id!: number;
  public title!: string;
  public description!: string;
  public completed!: boolean;
  public createdBy!: number;
}

Task.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  createdBy: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  sequelize,
  tableName: 'tasks',
});

export default Task;