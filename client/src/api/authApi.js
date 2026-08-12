import API from "./axios";

/*
=====================================================
BANK APP AUTH TOKEN
=====================================================
*/

const BANK_TOKEN_KEY = "bankAppToken";


/*
=====================================================
LOGIN USER
=====================================================
*/

export const loginUser = async (userData) => {
    const response = await API.post(
        "/auth/login",
        userData
    );

    const data = response.data;

    /*
    Save Bank App token using a unique key.

    This prevents another application from
    overwriting the Bank App authentication.
    */

    if (data?.token) {
        localStorage.setItem(
            BANK_TOKEN_KEY,
            data.token
        );
    }

    return data;
};


/*
=====================================================
REGISTER USER
=====================================================
*/

export const registerUser = async (userData) => {
    const response = await API.post(
        "/auth/register",
        userData
    );

    return response.data;
};


/*
=====================================================
LOGOUT USER
=====================================================
*/

export const logoutUser = () => {
    /*
    Remove ONLY the Bank App token.

    Do NOT use localStorage.clear()
    because that can remove data belonging
    to another application.
    */

    localStorage.removeItem(BANK_TOKEN_KEY);
};