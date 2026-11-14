import axios from 'axios';

//creamos instancia de axios
const axiosClient = axios.create({
    //definimos la direccion hacia nuestro backend 
    baseURL: 'http://localhost:4000/api',

    //headers que le dice al backend que enviaremos datos en formato json
    headers: {
        'Content-Type': 'application/json'
    }
});

export default axiosClient;