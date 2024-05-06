import React, { useState, useEffect } from 'react';
import './Home.css';

function Home() {
    const [inputState, setInputState] = useState('');
    const [listaOriginal, setListaOriginal] = useState([]);
    const [listaFiltrada, setListaFiltrada] = useState([]);
    const [textoNuevo, setTextoNuevo] = useState('');

    useEffect(() => {
        fetch('https://playground.4geeks.com/todo/users/dexpinbe')
            .then(response => response.json())
            .then(data => {
                setListaOriginal(data.todos);
                setListaFiltrada(data.todos);
            })
            .catch(error => console.error('Error:', error));
    }, []);

    const actualizarListas = (nuevaLista) => {
        setListaOriginal(nuevaLista);
        setListaFiltrada(nuevaLista);
    };

    const agregarNuevaTarea = () => {
        const nuevaTarea = {
            label: textoNuevo,
            is_done: false
        };
    
        fetch('https://playground.4geeks.com/todo/todos/dexpinbe', {
            method: 'POST',
            body: JSON.stringify(nuevaTarea),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Nueva tarea agregada:', data);
            actualizarListas([...listaOriginal, data]); 
            if (inputState === '' || data.label.toLowerCase().includes(inputState.toLowerCase())) {
                setListaFiltrada([...listaFiltrada, data]);
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    
        setTextoNuevo(''); 
    };
    

    const eliminarTarea = (index) => {
        const taskId = listaOriginal[index].id;
        fetch(`https://playground.4geeks.com/todo/users/dexpinbe/${taskId}`, {
            method: 'DELETE'
        })
        .then(() => {
            const nuevaLista = [...listaOriginal];
            nuevaLista.splice(index, 1);
            actualizarListas(nuevaLista);
        })
        .catch(error => console.error('Error:', error));
    };

    const limpiarTareas = () => {
        fetch('https://playground.4geeks.com/todo/users/dexpinbe', {
            method: 'DELETE'
        })
        .then(() => {
            actualizarListas([]);
        })
        .catch(error => console.error('Error:', error));
    };

    const filtrarTareas = (event) => {
        setInputState(event.target.value);
        const textoFiltrado = event.target.value;
        if (textoFiltrado === '') {
            setListaFiltrada(listaOriginal);
        } else {
            const estadoActualizado = listaOriginal.filter((item) => {
                return item.label.toLowerCase().includes(textoFiltrado.toLowerCase());
            });
            setListaFiltrada(estadoActualizado);
        }
    };

    const actualizarTextoNuevo = (event) => {
        setTextoNuevo(event.target.value);
    };
    
    return (
        <div className="background">
            <div className="task-list-container">
                <div className="task-list">
                    <input
                        type="text"
                        name=""
                        id=""
                        onChange={actualizarTextoNuevo} 
                        value={textoNuevo} 
                    />
                    <button className='agregar' onClick={agregarNuevaTarea}>Agregar</button>
                    <button className='limpiar' onClick={limpiarTareas}>Limpiar</button>

                    <ul>
                        {listaFiltrada.map((item, index) => {
                            return (
                                <li key={index}>
                                    {item.label}
                                    <button className="eliminar" onClick={() => eliminarTarea(index)}><i className="fas fa-times"></i></button>
                                </li>
                            );
                        })}
                    </ul>

                    <div className="task-counter">
                        Tareas: {listaFiltrada.length}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Home;