import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import sequelize from './database';
import Task from './models/modelTask'; // Importa el modelo Task
import User from './models/modelUser'; // Importa el modelo User
import bcrypt from 'bcrypt'; // Para manejar contraseñas seguras
import jwt from 'jsonwebtoken'; // Para generar tokens de autenticación

const app = express();
const port = process.env.PORT ?? 3000;
const JWT_SECRET = 'secret_kanubys_access_4321'; // Clave secreta para el token

interface UserPayload {
  userId: number;
  username: string; // O cualquier otro campo que quieras incluir
}

interface CustomRequest extends Request {
  user?: UserPayload; // O define un tipo más específico si lo deseas
}

app.use(cors());
app.use(express.json())

// Función para sincronizar la base de datos
const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: true });
    console.log('Database synchronized successfully.');

    // Inserta datos iniciales
    await initializeData();
  } catch (error) {
    console.error('Error synchronizing the database:', error);
  }
};

// Inicializa datos en la tabla Tasks
const initializeData = async () => {
  const initialTasks = [
    { title: 'Crear Frontend', description: 'Crea el frontend en React Typescript en una aplicacion para administracion de tareas', completed: true },
    { title: 'Crear backend', description: 'Crear el backend con sus respectivo get, put, post, delete usando como endpoint "tasks"', completed: true },
    { title: 'Conectar a base de datos', description: 'Crear una base de datos PostgreSQL usando Sequelize', completed: true },
    { title: 'Usar autenticacion', description: 'Implementar autenticacion JWT para el CRUD', completed: false },
    { title: 'Crear validaciones', description: 'Crear las respectivas validaciones del CRUD en el frontend y el backend', completed: false },
    { title: 'Filtro', description: 'Crear un filtro en el frontend para seleccionar tareas completadas o pendientes', completed: true },
    { title: 'Usar cache', description: 'Implementar cache para optimizacion de tareas en el backend', completed: false },
  ];

  try {
    await Task.bulkCreate(initialTasks); // Inserta varios registros a la vez
    console.log('Initial data inserted successfully.');
  } catch (error) {
    console.error('Error inserting initial data:', error);
  }
};

// Función para probar la conexión
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await syncDatabase(); // Llama a syncDatabase aquí
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// Ejecutar las funciones
testConnection();

// Middleware para verificar el token JWT
const authenticateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  console.log(token)
  if (!token) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Token no válido', token: token });
    }
    req.user = user; // Adjunta los datos del usuario al request
    next();
  });
};

// Ruta para el login (POST /login)
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Verifica si el usuario existe en la base de datos
  const user = await User.findOne({ where: { username } });
  if (!user) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  }

  // Verifica si la contraseña es correcta
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(400).json({ message: "Contraseña incorrecta" });
  }

  // Genera un token JWT
  const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

  // Retorna el token al cliente
  return res.status(200).json({ token });
});

// Leer todas las tareas (GET /tasks)
app.get('/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.findAll();
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return res.status(500).json({ message: 'Error al obtener las tareas' });
  }
});

// Crear una tarea (POST /tasks)
app.post('/tasks', authenticateToken, async (req: CustomRequest, res) => {
  const { title, description, completed} = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }
  if (title.length <= 3) {
    return res.status(405).json({ message: "Titulo debe ser mayor a 3 caracteres" });
  }
  try {
    const userId = req.user?.userId;
    const newTask = await Task.create({ title, description, completed, createdBy: userId});
    return res.status(201).json(newTask);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    return res.status(500).json({ message: 'Error al crear la tarea' });
  }
});

// Actualizar una tarea (PUT /tasks/:id)
app.put('/tasks/:id', authenticateToken, async (req, res) => {
  const taskId = parseInt(req.params.id);
  const { title, description, completed } = req.body;

   try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    if (title.length <= 3) {
    return res.status(405).json({ message: "Titulo debe ser mayor a 3 caracteres" });
  }

    // Actualiza los campos
    task.title = title || task.title;
    task.description = description || task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    await task.save(); // Guarda los cambios

    return res.status(200).json(task);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    return res.status(500).json({ message: 'Error al actualizar la tarea' });
  }
});

// Eliminar una tarea (DELETE /tasks/:id)
app.delete('/tasks/:id', authenticateToken, async (req, res) => {
  const taskId = parseInt(req.params.id);

  try {
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    await task.destroy(); // Elimina la tarea
    return res.status(200).json({ message: 'Tarea eliminada' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return res.status(500).json({ message: 'Error deleting task' });
  }
});

//Obtener tareas completadas
app.get('/tasks/completed/:value', authenticateToken, async (req, res) => {
  const completedState = req.params.value === 'true';

  try {
    const tasks = await Task.findAll({where: {completed: completedState}});
    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    return res.status(500).json({ message: 'Error al obtener las tareas' });
  }
});

// Crear usuario
app.post('/register', async (req, res) => {
  const { username, password, email} = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10); //encriptar password
    await User.create({ username, password: hashedPassword, email });
    return res.status(201).json('Usuario creado');
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    return res.status(500).json({ message: 'Error al crear el usuario' });
  }
});

// Obtener usuario
app.get('/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.findAll({attributes: ['id', 'username'],});
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los users', error);
    return res.status(500).json({ message: 'Error al obtener los users' });
  }
});

app.get('/validateToken', authenticateToken, (req: CustomRequest, res) => {
  // Si el token es válido, devolver una respuesta con éxito
  return res.status(200).json({ valid: true, message: 'Token válido', user: req.user });
});

app.listen(port, () => {
  console.log(`El servidor se esta ejecutand en http://localhost:${port}`)
})