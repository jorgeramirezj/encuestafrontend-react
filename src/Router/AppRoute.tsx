import { Redirect, RouteProps, RouteComponentProps, Route } from "react-router-dom";
import { RouteType } from "../types";
import { useAuthState } from "../context/authContext";

interface AppRouteProps extends RouteProps{
    component: any,
    routeType: RouteType
}

// Crear un nuevo componente
const AppRoute = (props: AppRouteProps) => {

    // Sacamos desde PROPS algunas propiedades
    const { component: Component, path, routeType, ...rest } = props;

    // Saber si el usuario esta autenticado en el sistema
    const user = useAuthState();

    const renderComponent = (routeProps: RouteComponentProps) => {
        switch (routeType){
            case "PRIVATE":
                if(user.isAuthenticated){
                    return <Component {...routeProps}></Component>
                } else {
                    return <Redirect to="/login"></Redirect>
                }
            case "GUEST":
                if(!user.isAuthenticated){
                    return <Component {...routeProps}></Component>
                } else {
                    return <Redirect to="/user"></Redirect>
                }
            case "PUBLIC":
                return <Component {...routeProps}></Component>
        }
    }

    return (
        <Route {...rest} path={path} render={(routeProps) => renderComponent(routeProps)}></Route>
    );

}

export default AppRoute;