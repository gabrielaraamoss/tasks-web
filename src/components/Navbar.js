import React, { useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { TareasContext } from '../helpers/TareasProvider';
import { auth } from '../config/firebase-config';
import { useNavigate } from 'react-router-dom'; 

function Navbar() {
  const { darkMode, toggleDarkMode } = useContext(TareasContext);
  const navigate = useNavigate(); 

  const handleCerrarSesion = () => {
    auth.signOut() 
      .then(() => {
        navigate('/login'); 
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  };

  return (
    <nav className={`navbar ${darkMode ? 'dark' : ''}`}>
      <div className="navbar-container">
        <h1 className="navbar-title">Gestor de tareas</h1>
        <div className="navbar-icons">
          <FontAwesomeIcon
            icon={darkMode ? faSun : faMoon}
            className="navbar-icon"
            onClick={toggleDarkMode}
            title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}
          />
          <FontAwesomeIcon
            icon={faSignOutAlt}
            className="navbar-icon"
            onClick={handleCerrarSesion}
          />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
