import React, { useContext, useState } from 'react';
import '../App.css';
import Modal from '../components/Modal';
import { TareasContext } from '../helpers/TareasProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPenToSquare, faTriangleExclamation } from '@fortawesome/free-solid-svg-icons';
import { eliminarTarea, editarTarea } from '../redux/slices/tareasSlice';
import { useDispatch, useSelector } from 'react-redux';

function Tareas() {
    const dispatch = useDispatch();
    const tareas = useSelector(state => state.tarea.tareas);
    const userId = useSelector(state => state.user.userId);
    const tareasUsuario = tareas.filter(tarea => tarea.userId === userId);
    const { darkMode } = useContext(TareasContext);
    const [filtroEstado, setFiltroEstado] = useState('todas');
    const [orden, setOrden] = useState('nombre');
    const [modalData, setModalData] = useState({ show: false, tarea: null });

    const handleAgregarTarea = () => {
        setModalData({ show: true, tarea: null });
    };

    const handleEditarTarea = (tarea) => {
        setModalData({ show: true, tarea: { ...tarea } });
    };

    const handleEliminarTarea = (id) => {
        dispatch(eliminarTarea(id)); 
    };

    const handleCerrarModal = () => {
        setModalData({ show: false, tarea: null });
    };

    const toggleCompletada = (id) => {
        const tarea = tareasUsuario.find(t => t.id === id);
        if (tarea) {
            const completada = !tarea.completada;
            dispatch(editarTarea({ ...tarea, completada }));
        }
    };

    const tareasFiltradas = () => {
        switch (filtroEstado) {
            case 'completadas':
                return tareasUsuario.filter(tarea => tarea.completada);
            case 'pendientes':
                return tareasUsuario.filter(tarea => !tarea.completada);
            default:
                return tareasUsuario;
        }
    };

    const handleOrdenarTareas = (tareas) => {
        switch (orden) {
            case 'fecha':
                return tareas.sort((a, b) => b.fechaCreacion - a.fechaCreacion);
            case 'prioridad':
                return tareas.sort((a, b) => a.prioridad.localeCompare(b.prioridad));
            case 'nombre':
            default:
                return tareas.sort((a, b) => a.nombre.localeCompare(b.nombre));
        }
    };

    const tareasMostradas = handleOrdenarTareas(tareasFiltradas());

    const formatearFecha = (fecha) => {
        const opciones = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
        return new Date(fecha).toLocaleDateString('es-ES', opciones);
    };
    
    return (
        <div className={`tareas-container ${darkMode ? 'dark' : ''}`}>
            <h1>Mis tareas</h1>
            <div className="tareas-form">
                <button className="agregar" onClick={handleAgregarTarea}>Agregar Tarea</button>
            </div>
            <div className="filtros">
                <div className="por-estado">
                    <label htmlFor="filtro-estado">Filtrar por estado:</label>
                    <select id="filtro-estado" value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
                        <option value="todas">Todas</option>
                        <option value="completadas">Completadas</option>
                        <option value="pendientes">Pendientes</option>
                    </select>
                </div>
                <div className="por-filtro">
                    <label htmlFor="ordenar-por">Ordenar por:</label>
                    <select id="ordenar-por" value={orden} onChange={(e) => setOrden(e.target.value)}>
                        <option value="nombre">Nombre</option>
                        <option value="fecha">Fecha</option>
                        <option value="prioridad">Prioridad</option>
                    </select>
                </div>
            </div>
            <ul className={`lista-tareas ${darkMode ? 'dark' : ''}`}>
                {tareasMostradas.length === 0 ? (
                    <div className="mensaje-vacio">
                        <FontAwesomeIcon icon={faTriangleExclamation} className="alerta" />
                        <p>No hay tareas disponibles.</p>
                    </div>
                ) : (
                    tareasMostradas.map((tarea) => (
                        <li key={tarea.id} className={`tarjeta-tarea ${tarea.completada ? 'completada' : ''}`}>
                            <input
                                type="checkbox"
                                checked={tarea.completada}
                                onChange={() => toggleCompletada(tarea.id)}
                            />

                            <div className="info-tarea">
                                <h2>{tarea.nombre}</h2>
                                <p><span className="sombreado">Fecha:</span> {formatearFecha(tarea.fecha)}</p>
                                <p className="sombreado">Nota:</p>
                                <p>{tarea.nota}</p>
                            </div>
                            <div className={`estado-tarea ${tarea.completada ? 'completada' : 'pendiente'}`}>
                                <span className="estado">{tarea.completada ? 'Completado' : 'Pendiente'}</span>
                            </div>
                            <div className="acciones">
                                <button className="editar" onClick={() => handleEditarTarea(tarea)}>
                                    <FontAwesomeIcon icon={faPenToSquare} title="Editar" />
                                </button>
                                <button className="eliminar" onClick={() => handleEliminarTarea(tarea.id)}>
                                    <FontAwesomeIcon icon={faTrash} title="Eliminar" />
                                </button>
                            </div>
                        </li>
                    ))
                )}
            </ul>
            <Modal
                mostrar={modalData.show}
                tarea={modalData.tarea}
                onCerrar={handleCerrarModal}
            />
        </div>
    );
}

export default Tareas;
