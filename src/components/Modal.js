import React, { useState, useEffect, useContext } from 'react';
import { TareasContext } from '../helpers/TareasProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { agregarTarea, editarTarea } from '../redux/slices/tareasSlice';

function Modal({ mostrar, tarea, onCerrar }) {
  const dispatch = useDispatch();
  const userId = useSelector(state => state.user.userId);
  const { darkMode } = useContext(TareasContext);

  const [tareaData, setTareaData] = useState({
    nombre: '',
    fecha: '',
    prioridad: 'normal',
    nota: '',
  });

  useEffect(() => {
    if (tarea) {
      setTareaData(prevState => ({ ...prevState, ...tarea }));
    } else {
      setTareaData({
        nombre: '',
        fecha: '',
        prioridad: 'normal',
        nota: '',
      });
    }
  }, [tarea]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTareaData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleAgregarEditarTarea = () => {
    const { nombre, fecha, prioridad } = tareaData;

    if (nombre.trim() === '' || fecha.trim() === '' || prioridad.trim() === '') {
      toast.error('Por favor, complete todos los campos obligatorios.');
      return;
    }

    const tareaActualizada = {
      ...tareaData,
      id: tarea ? tarea.id : Date.now(),
      userId: userId,
      completada: tarea ? tarea.completada : false,
    };

    if (tarea) {
      dispatch(editarTarea(tareaActualizada));
    } else {
      dispatch(agregarTarea(tareaActualizada));
      toast.success("Tarea agregada con éxito");
    }
    onCerrar();
  };

  const handleCerrarModal = () => {
    setTareaData({
      nombre: '',
      fecha: '',
      prioridad: 'normal',
      nota: '',
    });
    onCerrar();
  };

  return (
    <div className={`modal ${mostrar ? 'mostrar' : ''}`}>
      <ToastContainer />
      <div className={`modal-contenido  ${darkMode ? 'dark' : ''}`}>
        <span className="cerrar" onClick={handleCerrarModal}>&times;</span>
        <h2>{tarea ? 'Editar Tarea' : 'Agregar Tarea'}</h2>
        <form>
          <div className="campo-formulario">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={tareaData.nombre} onChange={handleChange} />
          </div>
          <div className="campo-formulario">
            <label>Fecha y hora:</label>
            <input type="datetime-local" name="fecha" value={tareaData.fecha} onChange={handleChange} />
          </div>
          <div className="campo-formulario">
            <label>Prioridad:</label>
            <select name="prioridad" value={tareaData.prioridad} onChange={handleChange}>
              <option value="normal">Normal</option>
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </select>
          </div>
          <div className="campo-formulario">
            <label>Nota:</label>
            <textarea name="nota" value={tareaData.nota} onChange={handleChange}></textarea>
          </div>
          <button type="button" onClick={handleAgregarEditarTarea}>{tarea ? 'Editar' : 'Agregar'} Tarea</button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
