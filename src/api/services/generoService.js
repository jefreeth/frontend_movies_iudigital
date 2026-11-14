import axiosClient from "../axiosClient";

//creamos un objeto que tiene todas las operacioenes CRUD
 export const generoService = {

    //obtener los generos 
    getAll: async () => {
        //hace una peticion get 
        const response = await axiosClient.get('/generos');
        return response.data;
    },

    //crear genero
    create: async (nuevoGenero) => {
        //envia el objeto al body de la peticion 
        const response = await axiosClient.post('/generos', nuevoGenero);
        return response.data;
    },

    //actualizar genero
    update: async (id, datosActualizados) => {
        //conectar el id en la url y enviar los datos nuevos
const response = await axiosClient.put(`/generos/${id}`, datosActualizados);
        return response.data;
    },

    //eliminar genero
    delete: async (id) => {
        const response = await axiosClient.delete(`/generos/${id}`);
        return response.data;
    }
 };



