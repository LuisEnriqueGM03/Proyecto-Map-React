import axios from "axios";
import { useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ClientMenu from "../../../components/ClientMenu";
import  jwtDecode  from "jwt-decode";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [contraseña, setPassword] = useState("");
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false); 

    const handleLogin = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setValidated(true);

        if (!email || !contraseña) {
            setError("Por favor complete todos los campos.");
            return;
        }

        setLoading(true); 

        try {
            const res = await axios.post("http://localhost:3000/usuarios/login/", { email, contraseña });
            console.log("Login exitoso:", res.data);
            
            const token = res.data.token;
            localStorage.setItem("token", token);


            const decoded = jwtDecode(token);
            console.log("Token decodificado:", decoded);
            switch (decoded.tipo) {
                case "Administrador":
                    navigate("/adminDashboard");
                    break;
                case "Verificador":
                    navigate("/verificadorDashboard");
                    break;
                default:
                    setError("Tipo de usuario desconocido");
                    break;
            }
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            if (error.response && error.response.status === 401) {
                setError("Credenciales incorrectas. Inténtelo nuevamente.");
            } else {
                setError("Error al conectar con el servidor. Inténtelo más tarde.");
            }
        } finally {
            setLoading(false); 
        }
    };

    return (
        <>
            <ClientMenu />
            <Container className="mt-4 d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <Card className="p-4 fold-big-login" style={{ width: '400px' }}>
                    <Card.Body>
                        <h2 className="mb-4 text-center">Iniciar Sesión</h2>
                        <Form noValidate validated={validated} onSubmit={handleLogin}>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingrese su email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="login"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese un email válido.
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Label>Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingrese su contraseña"
                                    value={contraseña}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="login"
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese su contraseña.
                                </Form.Control.Feedback>
                            </Form.Group>
                            {error && <p className="text-danger text-center">{error}</p>}
                            <div className="d-flex justify-content-center">
                                <Button className="btn-tipo" type="submit" disabled={loading}>
                                    {loading ? "Cargando..." : "Iniciar Sesión"}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default Login;
