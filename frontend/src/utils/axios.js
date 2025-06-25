import axios from 'axios';

const instance = axios.create({
    baseURL: "https://ecommerce-store-api-three.vercel.app/",
    withCredentials: true,

});

export default instance;