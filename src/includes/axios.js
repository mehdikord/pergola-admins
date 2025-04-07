//Axios Configs
import axios from "axios";
import {Stores_Auth} from "@/stores/auth/auth.js";
window.axios = axios;


window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
window.axios.defaults.baseURL="https://core.pergola.ir";


window.axios.interceptors.response.use(
    response => {

        return response; // Return the response or modify it before it's returned
    },
    error => {
        if (error.response.status === 401) {
            Stores_Auth().AuthLogout()
        }

        return Promise.reject(error);

    }
)