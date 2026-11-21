import axios from 'axios';

//creamos instancia de axios
const axiosClient = axios.create({
    //definimos la direccion hacia nuestro backend 
    baseURL: import.meta.env.VITE_API_URL,

    //headers que le dice al backend que enviaremos datos en formato json
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;