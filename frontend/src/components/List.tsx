import { useState, useEffect } from "react";
import './styles.css'
import { FaEdit, FaTrash } from "react-icons/fa"; // Importar íconos de Font Awesome
import Modal from './Modal';
import {getUsers} from '../services/apis'

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdBy?: number;
}

interface User {
  id: number;
  username: string;
}

interface ListProps{
    data: Task[],
    onDelete?: (id: number) => Promise<void>;
    onUpdate?: (task: Task) => Promise<void>;
}

function List({data, onDelete = async () => {}, onUpdate = async () => {}}: ListProps){
    const [index, setIndex] = useState(-1);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null); // Estado para la tarea seleccionada
    const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
    const [users, setUsers] =  useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Error al cargar los usuarios:', error);
        }
        };

        fetchUsers();
    }, []);
    
    const handleClick = (i: number) => {
        setIndex(i);
    }

    //para mostrar el modal edit
    const editar = (task: Task) => {
        setSelectedTask(task); // Establece la tarea seleccionada
        setShowModal(true); // Muestra el modal
    }

    //manejar el update entre modal, list y app
    const handleUpdate = async (updatedTask: Task) => {
        try {
            await onUpdate(updatedTask); // Llama a la función onUpdate pasada como prop
            setShowModal(false); // Cierra el modal
        } catch (error) {
            console.error('Error al actualizar la tarea:', error);
        }
    };

    const eliminar = async (id: number) => {
        try {
            await onDelete(id); // Llama a la función onDelete pasada como prop
        } catch (error) {
            console.error('Error al tratar de eliminar la tarea:', error);
        }
    };

    const handleClose = () => setShowModal(false);

    return (
    <>
      <ul className="list-group">
        {data.map((task, i) => {
          // Encuentra el usuario que creó la tarea
          const user = users.find(u => u.id === task.createdBy);

          return (
            <li onClick={() => handleClick(i)} key={task.id} className={`list-group-item ${index === i ? "selected" : ""}`}>
              <div className="contenedor">
                <button key={`button-editar-${task.id}`} onClick={() => editar(task)} type="button" className="btn btn-primary" style={{ textSizeAdjust: '50%' }}><FaEdit /></button>
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <h6 className="card-subtitle mb-2 text-body-secondary">{task.description}</h6>
                  <p className="card-text">{user ? `Creado por: ${user.username}` : ''}</p>
                </div>
                <button key={`button-eliminar-${task.id}`} onClick={() => eliminar(task.id)} type="button" className="btn btn-danger" style={{ textSizeAdjust: '50%' }}><FaTrash /></button>
              </div>
            </li>
          );
        })}
      </ul>
      <Modal show={showModal} onClose={handleClose} task={selectedTask} onUpdate={handleUpdate} />
    </>
  );
}

export default List;