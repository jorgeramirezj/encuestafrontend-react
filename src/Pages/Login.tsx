import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Spinner } from "react-bootstrap";
import Alert from "react-bootstrap/Alert";
import React, { useState } from "react";
import { loginUser } from "../_services/UserServices";
import { useAuthDispatch } from "../context/authContext";

const Login = () => {

    // generar un estado para el paso del correo electronico y password
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // manejo de errores desde el backend
    const [error, setError] = useState("");
    // creamos una bandera para saber si se esta enviando la peticion al backend
    const [sendingData, setSendingData] = useState(false);

    const authDispatch = useAuthDispatch();

    // creacion de la funcion LOGIN
    const login = async (e: React.SyntheticEvent) => {
        e.preventDefault();
        console.log(email, password)
        // Nos devuelve una promesa, como decir un "Observable"
        // de esta forma, podemos definir a nuestra funcion LOGIN
        // como una funcion asincrona = async
        try {
            setSendingData(true);
            setError("");
            const res = await loginUser(email, password);
            const token = res.data.token;
            // Hacemos uso apenas nos autenticamos
            authDispatch({
                type: 'login',
                token
            });

            // Quitamos la siguiente linea, no la necesitamos
            //setSendingData(false);
        } catch (errors: any) {
            if(errors.response){
                // error 401
                errors.response.status === 401 && setError("No se puede iniciar sesión con esas credenciales");
            }
            //setError(errors.response.data.errors);
            console.log(errors.response);
            // Recordar que este setSendingData es para frenar el spinner
            setSendingData(false);
        }
        
    }

    // casteo de un booleano => !!<atributo-objeto>

    return (
        <Container>
            <Row>
                <Col lg="5" md="10" sm="10" className="mx-auto">
                    <Card className="mt-5">
                        <Card.Body>
                            <h4>Iniciar sesión</h4><hr />

                            <Form onSubmit={login} autoComplete="off">
                                <Form.Group className="mb-3" controlId="email">
                                    <Form.Label>Correo electronico</Form.Label>
                                    <Form.Control
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        type="email" placeholder="e.g. email@dominio.com"></Form.Control>
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="password">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        type="password" placeholder="**********"></Form.Control>
                                </Form.Group>
                                <Button type="submit">
                                    {sendingData ? <>
                                        <Spinner
                                            animation="border"
                                            as="span"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        ></Spinner>&nbsp;
                                        <span>Iniciando sesión...</span>
                                    </> : <>Iniciar sesión</>}
                                </Button>
                            </Form>
                            <Alert className="mt-4" show={!!error} variant="danger">
                                {error}
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

export default Login;