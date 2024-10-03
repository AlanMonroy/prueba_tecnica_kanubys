import axios, {AxiosError} from 'axios';

const API_URL = 'http://localhost:3000'; // Cambia por la URL de tu backend

// Crear una instancia de Axios
const apiClient = axios.create({
  baseURL: API_URL,
});

// Interceptor para agregar el token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token; // Agrega el token a las cabeceras
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Login
export const loginKanub = async (user: { username: string; password: string}) => {
  try {
    const response = await apiClient.post('/login', user);
    // Guardar el token en localStorage
    localStorage.setItem('token', response.data.token);
    return response;

  } catch (error) {
    console.error('Error al iniciar sesion');
    throw error;
  }
};

// Obtener todas las tareas
export const getTasks = async () => {
  try {
    const response = await apiClient.get(`/tasks`);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw error;
  }
};

// Crear una nueva tarea
export const createTask = async (task: { title: string; description: string, completed: boolean}) => {
  try {
    const response = await apiClient.post(`/tasks`, task);
    return response.data;
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    throw error;
  }
};

// Buscar tareas por Completed
export const getTasksCompleted = async (value: string) => {
  try {
    //const response = await axios.get(`${API_URL}/tasks/completed/${value}`);
    const response = await apiClient.get(`/tasks/completed/${value}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw error;
  }
};


// Eliminar tarea
export const deleteTask = async (id: number) => {
  try {
    const response = await apiClient.delete(`/tasks/${id}`);
    return response;
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw error;
  }
};

// Actualiar una tarea
export const updateTask = async (task: { title: string; description: string, completed: boolean}, id: number) => {
  try {
    const response = await apiClient.put(`/tasks/${id}`, task);
    return response;
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw error;
  }
};

// Crear usuario
export const registerUser = async (user: { username: string; password: string, email: string}) => {
  try {
    const response = await apiClient.post(`/register`, user);
    return response;
  } catch (error) {
    console.error('Error al crear el usuario');
    throw error;
  }
};

// Obtener los users
export const getUsers = async () => {
  try {
    const response = await apiClient.get(`/users`);
    return response.data; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    throw error;
  }
};

export const validateToken = async () => {
  try {
    const response = await apiClient.get(`/validateToken`);
    return response; // Devuelve los datos de la respuesta
  } catch (error) {
    console.error('Token no valido', error);
    throw error;
  }
};