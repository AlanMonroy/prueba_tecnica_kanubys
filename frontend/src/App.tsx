import DoList from './components/DoList'
import React, { useState, useEffect } from 'react';
import './components/styles.css';  // Estilos
import Register from './components/Register';  // El nuevo componente de registro
import { loginKanub, registerUser, validateToken} from './services/apis'

function App() {
  interface User{
    username: string;
    password: string;
    email: string;
  }
  const [isAuthenticated, setIsAuthenticated] = useState(false);  // Estado para autenticación
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegister, setShowRegister] = useState(false);
  
  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('token'); // Asegúrate de tener el token

      if (token) {
        try {
          await validateToken(); // Pasa el token a la función
          setIsAuthenticated(true);
        } catch (error) {
          console.error("Error validando el token:", error);
          handleLogout(); // Llama a la función de logout si el token es inválido
        }
      } else {
        handleLogout(); // Si no hay token, cierra sesión
      }
    };

    validate(); // Ejecuta la validación
  }, []); // Ejecuta el efecto solo al montar el componente

  // Función para manejar el login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Llamada a la API para iniciar sesión
      const response = await loginKanub({ username, password });
      
      if (response.status === 200) {
        setIsAuthenticated(true);  // Autenticación exitosa
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert('Usuario o contraseña incorrecta');  // Mensaje de error
    }
  };

  // Función para manejar el logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Limpia el token
    setIsAuthenticated(false);  // Cierra la sesión
  };

  // Función que se ejecuta cuando el registro es exitoso
  /*const handleRegisterSuccess = (newUsername: string) => {
    setShowRegister(false);  // Oculta el formulario de registro
    setUsername(newUsername);  // Autocompleta el nombre de usuario en el login
    alert(`Registro exitoso, por favor inicia sesión con ${newUsername}`);
  };*/

  const handleCancelRegister = () => {
    setShowRegister(false);  // Cambia el estado para mostrar el login
  };

  const handleRegisterUser = async (onRegister: User) => {
  try {
    await registerUser(onRegister); // Llama a la API para crear usuario
    setShowRegister(false);  // Oculta el formulario de registro
    console.log('Usuario creado')
  } catch (error) {
    console.error('Error al crear el usuario: ',error);
  }
  };

  if (!isAuthenticated) {
    if (showRegister) {
      return <Register onRegister={handleRegisterUser} onCancel={handleCancelRegister}/>;
    }
    // Si el usuario no está autenticado, muestra el formulario de login
    return (
      <>
    <div className="page-wrapper bg-gra-02 p-t-130 p-b-100 font-poppins">
    <div className='contenedor_login'>
      <div className='conter_log'>
      <form className="row g-3 needs-validation" onSubmit={handleLogin}>
        <h2 className='title'>Iniciar Sesion</h2>
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Usuario</label>
          <input
            className="form-control"
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <div className="valid-feedback">
            Looks good!
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Contraseña</label>
          <input
            className="form-control"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            />
          <div className="valid-feedback">
            Looks good!
          </div>
        </div>

        <button className="btn btn-primary" type="submit">Iniciar Sesión</button>
        {/* Botón para cambiar al formulario de registro */}
        <button className="btn btn-secondary" type="button" onClick={() => setShowRegister(true)}>
          ¿No tienes cuenta? Regístrate aquí
        </button>

      </form>
      </div>
    </div>
    </div>
    </>
    );
  }

  // Si el usuario está autenticado, muestra el contenido de la app
  return (
    <>
      <button className = "btn btn-danger" onClick={handleLogout}>Cerrar Sesión</button>
      <DoList />
    </>
  );
}

export default App;

