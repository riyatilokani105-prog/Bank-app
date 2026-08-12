import axios from "axios";

/*
=====================================================
BANK APP API
=====================================================
*/

const API = axios.create({
    baseURL: "https://bank-app-6l8z.onrender.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});


/*
=====================================================
BANK APP TOKEN KEY
=====================================================
*/

const BANK_TOKEN_KEY = "bankAppToken";


/*
=====================================================
REQUEST INTERCEPTOR
=====================================================
*/

API.interceptors.request.use(
    (config) => {

        // Get only the Bank App token
        const token = localStorage.getItem(BANK_TOKEN_KEY);

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


/*
=====================================================
RESPONSE INTERCEPTOR
=====================================================
*/

API.interceptors.response.use(
    (response) => {
        return response;
    },

    (error) => {

        /*
        If the Bank App token has expired or
        is invalid, remove ONLY the Bank App token.

        Do NOT use localStorage.clear().
        */

        if (error.response?.status === 401) {

            localStorage.removeItem(BANK_TOKEN_KEY);

            // Redirect to login only if user is not already there
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);


export default API;