import { obtenerPaises } from '../services/paisesServices.mjs';
// import { renderizarListaPaises } from '../views/responseView.mjs';
import Pais from '../models/paises.mjs'; // Asegúrate de importar el modelo Pais
import PaisesRepository from '../repositories/PaisesRepository.mjs';


//---------------------------------- ver ----------------------------------//

//TODOS LOS PAISES//
export async function todosPaises(req, res) {
     const filtrado = await PaisesRepository.obtenerTodos();
        res.render('dashboardPaises', { filtrado });
}


//PAISES CON IDIOMA ESPAÑOL//
export async function paisesEspanol(req, res) {
    const filtrado = await PaisesRepository.todosEspañol();
    const cantidad = filtrado.length;
    res.render('dashboardPaises', { filtrado, cantidad }); // Esta es suficiente
}



//---------------------------------- AGREGAR - EDITAR - ELIMINAR ----------------------------------//

//AGREGAR//
export async function crearPais(req, res) {
   
    // Extraer los datos enviados desde el formulario (req.body contiene los datos enviados por POST).
    const { official, capital, area, languages, population, borders, timezones } = req.body;

    // Crear el objeto con el formato esperado para el modelo de la base de datos.
    const nuevoPais = {
        name: { official }, // "name" tiene una subclave "official".
        capital: [capital], // "capital" se guarda como un array, aunque en el formulario es un string.
        area, // Área (número).
        languages: { spa: languages },
        population, // Población (número).
        borders: borders ? borders.split(',').map(b => b.trim()) : [], // Divide por comas y elimina espacios.
        timezones: timezones ? timezones.split(',').map(t => t.trim()) : [], // Similar a "borders".
        creador: "Agustina" // Agrega un valor estático para el creador.
    };
    try {
        // Intentar guardar el nuevo país en la base de datos usando el modelo "Pais".
        await Pais.create(nuevoPais);
        // Redirigir al usuario a la página principal después de agregar el país.
        res.redirect('/api/paises-espaniol');
    } catch (error) {
        // Manejar errores y responder con un mensaje adecuado.
        console.error('Error al agregar el país:', error);
        res.status(500).send('Hubo un problema al agregar el país.');
    }
}

//EDITAR//
export async function editarPaises(req, res) {
       // console.log("llego a editar post")
        const { official, capital, languages, area, population, borders, timezones } = req.body;
      
        const paisActualizado = {
            name: { official },
            capital: [capital],
            languages: { spa: languages },
            area,
            population,
            borders: borders ? borders.split(',') : [],
            timezones: timezones ? timezones.split(',') : [],
        };
        const {id} = req.params;
      await PaisesRepository.actualizar(id, paisActualizado);
       res.redirect('/api/paises-espaniol'); //redirecciona a paises con filtro español
}

export async function renderPaisEditar(req, res) {
        const {id} = req.params;
        const pais = await PaisesRepository.obtenerPorId(id);
        res.render('editarPais', { pais });
}



//ELIMINAR//
export async function eliminarPais (req, res) {
    try {
        await PaisesRepository.eliminar(req.params.id);
        res.redirect('/api/paises-espaniol'); // Redirige al dashboard después de eliminar
    } catch (error) {
        console.error("Error al eliminar país:", error);
        res.status(500).send("Error al eliminar el país.");
    }
}

//FUNCION PARA VER TODOS LOS PAISES DE LA API//
export async function cargarPaises(req, res) {
    try {
        const paises = await obtenerPaises(); 
        console.log(paises);
        // Guardar cada país en la base de datos
        for (const pais of paises) {
            // Verificar que el país tenga la propiedad 'subregion'
            if (!pais.subregion) {
                console.warn("El país no tiene subregión:", pais);
                continue; // O manejar esto de otra forma
            }
            const paisConCreador = {
                ...pais,
                creador: "Agustina" // Añadiendo la propiedad "creador"
            };
            try {
                await Pais.create(paisConCreador); // Guarda el país en la base de datos
            } catch (dbError) {
                console.error("Error al guardar país:", paisConCreador, dbError);
            }
        }
        //filtrar por nombre de creador
        const paisesFiltrados= await PaisesRepository.obtenerPorCreador("Agustina")
        res.send(paisesFiltrados)
       // res.send(renderizarListaPaises(paisesFiltrados));
    } catch (error) {
        console.error("Error al cargar países:", error);
        res.status(500).send("Error al cargar países");
    }
}


export function homeController(req, res) {
    res.render('index', { title: 'Pagina Principal' });
}