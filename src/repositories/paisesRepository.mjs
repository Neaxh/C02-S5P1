import paises from '../models/paises.mjs';
import IRepository from './IRepository.mjs';

class PaisesRepository extends IRepository{
    
    async obtenerTodos(){
        return await paises.find({});
    }

    async obtenerPorId(id) {
        return await paises.findById(id); // 
    }

    async actualizar(id, paisData) {
    
        console.log(paisData); 

        return await paises.findByIdAndUpdate(id, paisData, { new: true });
    }

    async eliminar(id){
        return await paises.findByIdAndDelete(id);
    }

    async todosEspañol() {
    return await paises.find({ "languages.spa": { $regex: /\bSpanish\b/i } });
    }

    async obtenerPorCreador(nombreCreador) {
        return await paises.find({ creador: nombreCreador, "languages.spa": "Spanish" });
    }

}
export default new PaisesRepository(); 