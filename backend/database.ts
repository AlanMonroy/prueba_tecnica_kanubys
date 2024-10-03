import { Sequelize, Model, DataTypes} from 'sequelize';
import fs from 'fs';
import path from 'path';

// Leer el archivo de configuración
const configPath = path.join(__dirname, '../configDbConection.json'); // Asegúrate de que la ruta sea correcta
const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));

/*const sequelize = new Sequelize('postgres', 'postgres', 'pas4321', {
  host: 'localhost',
  dialect: 'postgres',
});*/

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

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

export default sequelize;