import Card from './Card'
import List from './List'
import { useEffect, useState } from 'react';
import { getTasks, getTasksCompleted, deleteTask, updateTask, createTask} from '../services/apis'
import './styles.css'
import { FaPlus } from "react-icons/fa"; // Importar íconos de Font Awesome
import Modal from './Modal';

function DoList() {

  interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdBy?: number;
  }

  const [tasks, setTasks] = useState<Task[]>([]); // Estado para almacenar las tareas
  const [loading, setLoading] = useState(true);   // Estado para manejar la carga
  const [contenido, setContenido] = useState<JSX.Element | string>('');

  const fetchTasks = async () => {
    try {
      const data = await getTasks(); // Llama a la API para obtener las tareas
      setTasks(data); // Actualiza el estado con las tareas obtenidas
      const result = data.length ? <List data={data} /> : 'Sin elementos para mostrar.';
      setContenido(result); // Actualiza el contenido dinámico
      setLoading(false); // Cambia el estado de carga a false
    } catch (error) {
      console.error('Error handle cargar las tareas:', error);
    }
  }

  const handleDeleteTask = async (id: number) => {
    try {
      await deleteTask(id); // Llama a la API para eliminar la tarea
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id)); // Actualiza la lista de tareas
      console.log('Tarea eliminada')
    } catch (error) {
      console.error('Error handle eliminar la tarea:', error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      await updateTask(updatedTask, updatedTask.id); // Llama a la API para eliminar la tarea
      setTasks(prevTasks => prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))); // Actualiza la tarea en el estado
      handleTasksCompleted()
      console.log('Tarea actualizada')
    } catch (error) {
      console.error('Error handle eliminar la tarea:', error);
    }
  };

  //Funcion para cactualizar segun tareas: completas o pendientes
  const handleTasksCompleted = async () => {
    try {
      const data = await getTasksCompleted(String(completedSwitch)); // Llama a la API para obtener las tareas
      setTasks(data); // Actualiza el estado con las tareas obtenidas
      setLoading(false);
    } catch (error) {
      console.error('Error handle cargar las tareas:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const [completedSwitch, setEstado] = useState(true);

  //ACTUALIZACION AL USAR WL SWITCH
  useEffect(() => {
    handleTasksCompleted();
  }, [completedSwitch]);


  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Función para abrir el modal al hacer clic en el botón de agregar
  const handleOpenModal = () => {
    setSelectedTask(null); // Deja la tarea seleccionada en null si es para crear una nueva
    setShowModal(true); // Abre el modal
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleCreateTask = async (newTask: Omit<Task, 'id'>) => {
  try {
    const createdTask = await createTask(newTask); // Llama a la API para crear la nueva tarea
    setTasks(prevTasks => [...prevTasks, createdTask]); // Agrega la nueva tarea a la lista
    handleTasksCompleted()
  } catch (error) {
    console.error('Error al crear la tarea:', error);
  }
};

  return (
    <>
      <Card>
        <div className='contenedor'>
          <div className="switch">
            <div className="switch_1">
              <input id="switch-1" type="checkbox" onClick={() => setEstado(!completedSwitch)} defaultChecked={true} />
              <label htmlFor="switch-1"></label>
            </div>
            <label>{completedSwitch ? 'Completadas' : 'Pendientes'}</label>
          </div>
          <button onClick={handleOpenModal} type="button" className="btn btn-primary" style={{textSizeAdjust:'50%'}}><FaPlus/></button>
        </div>
        {tasks.length > 0 ? <List data={tasks} onDelete={handleDeleteTask} onUpdate={handleUpdateTask}/> : <p>No hay tareas para mostrar</p>}
      </Card>

      {showModal && (
        <Modal show={showModal} onClose={handleCloseModal} task={selectedTask} onCreate={handleCreateTask} />
      )}
    </>
  )
}

export default DoList
