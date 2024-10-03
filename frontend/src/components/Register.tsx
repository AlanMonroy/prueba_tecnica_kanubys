import React, { useState } from 'react';

interface User{
  username: string;
  password: string;
  email: string;
}

interface RegisterProps {
  onRegister: (newUser: User) => Promise<void>  // Función que se ejecuta cuando el registro es exitoso
  onCancel: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegister, onCancel}) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Función para manejar el envío del formulario de registro
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación simple
    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!username || !email || !password) {
      setError('Por favor, completa todos los campos');
      return;
    }

    setError('');  // Limpiar el error si todo está bien
    try{
      const newUser: User = {
        username,
        password,
        email
        };
      await onRegister(newUser);  // Notificar al padre que el registro fue exitoso
      onCancel()
      }catch(error){
        console.log('Error al ejecutar creacion de usuario: ', error)
      }
  };

  return (
    <>
    <div className="page-wrapper bg-gra-02 p-t-130 p-b-100 font-poppins">
    <div className='contenedor_login'>
      <div className='conter_log'>
      <form className="row g-3 needs-validation" onSubmit={handleRegister}>
        <h2 className='title'>Registro</h2>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div className="col-md-6">
          <label htmlFor="username" className="form-label">Nombre de usuario</label>
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
        <div className="col-md-6">
          <label htmlFor="email" className="form-label">Correo</label>
          <div className="input-group has-validation">
            <span className="input-group-text" id="inputGroupPrepend">@</span>
            <input
              className="form-control"
              aria-describedby="inputGroupPrepend"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="invalid-feedback">
              Please choose a username.
            </div>
          </div>
        </div>
        <div className="col-md-6">
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
        <div className="col-md-6">
          <label htmlFor="confirmPassword" className="form-label">Confirmar contraseña</label>
          <input
            className="form-control"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <div className="valid-feedback">
            Looks good!
          </div>
        </div>
        <div className="col-11">
          <button className="btn btn-primary" type="submit" onClick={handleRegister}>Registrarse</button>
        </div>
        <div className="col-12">
          <button className="btn btn-secondary" type="button" onClick={onCancel}>Cancelar</button>
        </div>
      </form>
      </div>
    </div>
    </div>
  </>
  );
};

export default Register;
