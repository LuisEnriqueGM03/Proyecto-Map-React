import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "../../../components/NavMenu.jsx";

const FormUsuario = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [tipo, setTipo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [validated, setValidated] = useState(false);

    useEffect(() => {
        if (!id) return;
        getUsuarioById();
    }, [id]);

    const getUsuarioById = () => {
        axios.get(`http://localhost:3000/usuarios/${id}`)
            .then(res => {
                const usuario = res.data;
                setNombre(usuario.nombre);
                setEmail(usuario.email);
                setTipo(usuario.tipo);
            })
            .catch(error => {
                console.log(error);
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

        const usuario = { nombre, email, tipo };

        if (!id && contraseña) {
            usuario.contraseña = contraseña;
        }

        if (id) {
            editUsuario(usuario);
        } else {
            insertUsuario(usuario);
        }
    };

    const editUsuario = (usuario) => {
        axios.put(`http://localhost:3000/usuarios/${id}`, usuario)
            .then(res => {
                console.log("Usuario actualizado:", res.data);
                navigate('/usuarioslista');
            })
            .catch(error => {
                console.log("Error al actualizar el usuario:", error);
            });
    };

    const insertUsuario = (usuario) => {
        axios.post('http://localhost:3000/usuarios', usuario)
            .then(res => {
                console.log("Usuario creado:", res.data);
                navigate('/usuarioslista');
            })
            .catch(error => {
                console.log("Error al crear el usuario:", error);
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
                        <h2 className="mb-4 text-center">{id ? "Editar Usuario" : "Crear Usuario"}</h2>
                        <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                            <Form.Group controlId="formNombre" className="mb-3">
                                <Form.Label className="title-2">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa el nombre del usuario"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese un nombre.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Label className="title-2">Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    placeholder="Ingresa el email del usuario"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese un email válido.
                                </Form.Control.Feedback>
                            </Form.Group>

                            {!id && (
                                <Form.Group controlId="formContraseña" className="mb-3">
                                    <Form.Label className="title-2">Contraseña</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Ingresa la contraseña del usuario"
                                        value={contraseña}
                                        onChange={(e) => setContraseña(e.target.value)}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Por favor ingrese una contraseña.
                                    </Form.Control.Feedback>
                                </Form.Group>
                            )}

                            <Form.Group controlId="formTipo" className="mb-3">
                                <Form.Label className="title-2">Tipo</Form.Label>
                                <Form.Select
                                    value={tipo}
                                    onChange={(e) => setTipo(e.target.value)}
                                    required
                                >
                                    <option value="">Seleccione el tipo</option>
                                    <option value="Administrador">Administrador</option>
                                    <option value="Verificador">Verificador</option>
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Por favor seleccione un tipo.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit" className="btn-tipo">
                                    {id ? "Guardar Cambios" : "Guardar Usuario"}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default FormUsuario;
