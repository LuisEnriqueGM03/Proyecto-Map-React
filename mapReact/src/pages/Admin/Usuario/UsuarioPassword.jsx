import axios from "axios";
import { useState, useEffect } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "../../../components/NavMenu.jsx";

const FormCambiarContraseña = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [usuario, setUsuario] = useState(null); 
    const [nuevaContraseña, setNuevaContraseña] = useState('');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUsuarioById();
    }, [id]);

    const getUsuarioById = () => {
        axios.get(`http://localhost:3000/usuarios/${id}`)
            .then((res) => {
                setUsuario(res.data); 
            })
            .catch((error) => {
                console.error("Error al obtener el usuario:", error);
                setError("No se pudo cargar la información del usuario.");
            });
    };

    const onGuardarClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        cambiarContraseña();
    };

    const cambiarContraseña = () => {
        setLoading(true);

        axios.put(`http://localhost:3000/usuarios/${id}/cambiar-contrasena`, { contraseña: nuevaContraseña })
            .then(() => {
                console.log("Contraseña actualizada exitosamente");
                navigate('/usuarioslista'); 
            })
            .catch((error) => {
                console.error("Error al cambiar la contraseña:", error);
                setError("Error al cambiar la contraseña. Inténtelo nuevamente.");
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <NavMenu />
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ height: '100vh' }}
            >
                <Card className="p-4 fold-big-login" style={{ width: '500px' }}>
                    <Card.Body>
                        <h2 className="mb-4 text-center">Cambiar Contraseña</h2>

                        {usuario ? (
                            <p className="text-center mb-4">
                                <strong>Email:</strong> {usuario.email}
                            </p>
                        ) : (
                            <p className="text-danger text-center">Cargando usuario...</p>
                        )}

                        <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                            <Form.Group controlId="formNuevaContraseña" className="mb-3">
                                <Form.Label className="title-2">Nueva Contraseña</Form.Label>
                                <Form.Control
                                    type="password"
                                    placeholder="Ingresa la nueva contraseña"
                                    value={nuevaContraseña}
                                    onChange={(e) => setNuevaContraseña(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese una nueva contraseña.
                                </Form.Control.Feedback>
                            </Form.Group>

                            {error && <p className="text-danger text-center">{error}</p>}

                            <div className="d-flex justify-content-center">
                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="btn-tipo"
                                    disabled={loading}
                                >
                                    {loading ? "Guardando..." : "Guardar Contraseña"}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default FormCambiarContraseña;
