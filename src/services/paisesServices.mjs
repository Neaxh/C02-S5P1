import PaisesRepository from '../repositories/PaisesRepository.mjs';
import axios from 'axios';
import Pais from '../models/paises.mjs';


const API_URL ='https://restcountries.com/v3.1/all'

// Definimos una función asincrónica que obtiene la lista de países desde una API.
export async function obtenerPaises() {
    try {
        // Hacemos una solicitud GET a la URL definida en API_URL utilizando Axios.
        const response = await axios.get(API_URL);
        
        // Si la solicitud es exitosa, devolvemos los datos de la respuesta.
        return response.data; 
    } catch (error) {
        // Si ocurre algún error durante la solicitud, lo capturamos y mostramos un mensaje con el error.
        console.error(`Error al obtener los países desde ${API_URL}:`, error.message);

        // Lanzamos el error nuevamente para que pueda ser manejado en otro lugar si es necesario.
        throw error;
    }
}


/* 
Axios se usa para realizar una solicitud HTTP GET a la URL especificada en API_URL. 
Esta solicitud tiene como propósito obtener datos (en este caso, la lista de países) desde una API. */