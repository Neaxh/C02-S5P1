import express from 'express';
import { cargarPaises, paisesEspanol, crearPais , editarPaises,  renderPaisEditar, eliminarPais, todosPaises, homeController} from '../controllers/paisesApiController.mjs';
import{Middleware} from '../validation/validationRules.mjs'


const routerApi = express.Router();

//endpoint para mostrar Pagina Principal
routerApi.get('/home',homeController);

//cargar todos los países desde la API
routerApi.get('/cargar-paises', cargarPaises); 

// ---- filtrar los resultados en paises que hablen español ---- //
routerApi.get('/paises-espaniol', paisesEspanol);


// Ruta GET para mostrar el formulario para agregar un nuevo país
routerApi.get('/agregar-pais', (req, res)=>{
    res.render('agregarPais') // Renderiza la vista 'agregarPais'
});
// Ruta POST para manejar la creación de un nuevo país
routerApi.post('/agregar-pais', Middleware, crearPais);  // Aplica el middleware y luego llama a la función 'crearPais'

//cargar el formulario de edición de un país, pasando el 'id' como parámetro
routerApi.get('/editar-pais/:id', renderPaisEditar); // Llama a la función 'renderPaisEditar' para mostrar el formulario de edición
// Ruta POST para procesar la edición de un país, pasando el 'id' como parámetro
routerApi.post('/editar-pais/:id',Middleware, editarPaises); // Aplica el middleware y luego llama a la función 'editarPaises' para guardar los cambios

//elimina el pais
routerApi.delete('/eliminar-pais/:id', eliminarPais);

//uso middleware para evaluar desde el servidor
routerApi.post('/midleware', Middleware);

//devuelvo el render todos los paises sin filtro
routerApi.get('/todosSinFiltro', todosPaises)

export default routerApi;