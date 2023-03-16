import axios from 'axios';
import { User } from '../types';
import jwtDecode from 'jwt-decode';

const TOKEN_KEY = "token";
const defaultUser: User = {
    email: "",
    isAuthenticated: false,
    token: ""
};

// funcion para guardar el token
const setToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
}

// funcion para recuperar el token del localStorage
const getToken = () => {
    return localStorage.getItem(TOKEN_KEY) || null;
}

// funcion para remover el token
const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
}

// funcion para autenticacion y logout
export const authenticate = (token?: string): User => {
    // si el token llega, lo asignamos al localStorage
    if(token){
        setToken(token);
    }

    // variable local para manejar el token
    const _token = token ? token : getToken();

    // si no existe retornamos el usuario por default
    if(!_token){
        return {...defaultUser}
    }

    // decodificar el token
    const decoded : any = jwtDecode(_token);

    // calcular tiempo actual, compatible con el tiempo actual del token
    const currentTime = Date.now() / 1000;

    if(decoded.exp < currentTime){
        removeToken();
        return {...defaultUser};
    }
    
    // el token es valido
    axios.defaults.headers.common["Authorization"] = _token;

    // Devolvemos al usuario autorizado
    return {...defaultUser, email: decoded.sub, isAuthenticated: true, token: _token}
}

export const logout = (): User => {
    removeToken();
    // eliminar token de axios
    delete axios.defaults.headers.common["Authorization"];
    return {...defaultUser};
}