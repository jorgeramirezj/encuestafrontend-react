import { User } from "../../types";
import { authenticate, logout } from "../../utils/auth";
import { AuthActions } from "../actions/authActions";
import produce from "immer";


export const authInitialState: User = authenticate();

// El estado de nuestra autenticacion
export const AuthReducer = produce((state: User, action: AuthActions): User => {
    switch(action.type){
        case "login":
            // logica del login
            // para no definir toda esa logica en esta seccion
            // se ha creado un archivo en Utils/auth.ts
            // para hacer uso del state.isAuthenticated se instalo "immer"
            state = authenticate(action.token);
            return state;
        case "logout":
            // logica del logout
            state = logout();
            return state;
        default:
            return state;
    }
});