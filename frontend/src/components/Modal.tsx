import { useState, useEffect } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface ModalProps {
  show: boolean;
  onClose: () => void;
  task: Task | null;
  onUpdate?: (updateTask: Task) => void;
  onCreate?: (newTask: Omit<Task, 'id'>) => void;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, task, onUpdate = () => {}, onCreate = () => {}}) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [completed, setCompleted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Cuando se abre el modal se inicalizan los valores
    useEffect(() => {
        if (task) {
        setTitle(task.title);
        setDescription(task.description);
        setCompleted(task.completed);
        }
    }, [task]);

    //Manipular switch de completed
    const handleSwitchChange = () => {
        setCompleted(!completed);
    };

    //validaciones front
    const validateForm = () => {
    if (title.length <= 3) {
      setError("El título debe tener al menos 3 caracteres.");
      return false;
    }

    if (title.length > 250) {
      setError("Titulo tiene un limite de 250 caracteres");
      return false;
    }

    if (description.length > 250) {
      setError("Descripcion tiene un limite de 250 caracteres");
      return false;
    }

    setError(null);
    return true;
  };

    const saveChanges = async () => {
        if (!validateForm()) return; // Si no es válido, no continúa
        try {
            if (task) {
                const updatedTask: Task = { 
                    id: task.id, // Usa el id existente
                    title, 
                    description, 
                    completed
                };
                await onUpdate(updatedTask); // Llama a la función onUpdate pasada como prop
            }
            onClose();
        } catch (error) {
            console.error('Error al tratar de actualizar la tarea:', error);
        }
    };

    const crearTarea = async () => {
        if (!validateForm()) return; // Si no es válido, no continúa
        try {
        const newTask = {
            title,
            description,
            completed
        };
        await onCreate(newTask); // Llama a la función onCreate pasada como prop
        onClose(); // Cierra el modal después de crear
        } catch (error) {
        console.error('Error al tratar de crear la tarea:', error);
        }
    };


    //si la bandera 'show' para mostrar es false
    if (!show) return null;

    //Modal
    return (
        <div className="modal fade show" tabIndex={-1} role="dialog" style={{ display: 'block' }}>
            <div className="modal-dialog" role="document">
            <div className="modal-content">
                <div className="modal-header">
                    <h5 className="modal-title">{task ? "Editar": "Crear"}</h5>
                </div>
                <div className="modal-body">
                    {error && <div className="alert alert-danger">{error}</div>} {/* Mostrar errores si hay */}

                    <div className="form-group">
                        <label htmlFor="taskTitle">Título</label>
                        <input
                            type="text"
                            id="taskTitle"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)} // Actualiza el título
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="taskDescription">Descripción</label>
                        <textarea
                            id="taskDescription"
                            className="form-control"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)} // Actualiza la descripción
                        />
                    </div>

                    <div className="form-group">
                        <label>Completado</label>
                        <div className="custom-control custom-switch">
                            <input
                            type="checkbox"
                            className="custom-control-input"
                            id="completedSwitch"
                            checked={completed}
                            onChange={handleSwitchChange} // Cambia el estado de completado
                            />
                            <label className="custom-control-label" htmlFor="completedSwitch">
                            {completed ? 'Completado' : 'Pendiente'}
                            </label>
                        </div>
                    </div>

                </div>
                <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                    Cerrar
                </button>
                {task && (<button type="button" className="btn btn-primary" onClick={saveChanges}>Guardar cambios</button>)}
                {!task && (<button type="button" className="btn btn-primary" onClick={crearTarea}>Crear tarea</button>)}
                </div>
            </div>
            </div>
        </div>
    )
}

export default Modal;