import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Container, Row, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavMenu from "../../../components/NavMenu.jsx";

const ListaUsuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [filteredUsuarios, setFilteredUsuarios] = useState([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        getListaUsuarios();
        document.title = "Lista de Usuarios";
    }, []);

    const getListaUsuarios = () => {
        axios.get('http://localhost:3000/usuarios')
            .then(res => {
                setUsuarios(res.data);
                setFilteredUsuarios(res.data);
            })
            .catch(error => {
                console.log(error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el usuario?");
        if (!confirm) return;

        axios.delete(`http://localhost:3000/usuarios/${id}`)
            .then(() => {
                getListaUsuarios();
            })
            .catch(error => {
                console.log(error);
            });
    };

    const busqueda = (e) => {
        const value = e.target.value;
        setSearch(value);
        const filtered = usuarios.filter(usuario =>
            usuario.nombre.toLowerCase().includes(value.toLowerCase()) ||
            usuario.email.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredUsuarios(filtered);
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-4">
                <Card className="p-4 fold-big">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="mb-0">Lista de Usuarios</h2>
                            <Form.Control
                                className="busqueda"
                                type="text"
                                placeholder="Buscar por nombre o email"
                                value={search}
                                onChange={busqueda}
                                style={{ maxWidth: '650px' }}
                            />
                            <Button as={Link} to="/usuarios/crear" className="btn-user">
                                <i className="fas fa-plus me-2"></i> Agregar Usuario
                            </Button>
                        </div>

                        <Row>
                            {filteredUsuarios.map((usuario) => (
                                <Col xs={12} sm={6} md={4} lg={3} key={usuario.id} className="mb-4">
                                    <Card className="fold-usuario-card fold-usuario h-100">
                                        <Card.Body className="d-flex flex-column justify-content-between align-items-center ">
                                            <div>
                                                <Card.Title className="nombre mb-3 text-center ">
                                                    {usuario.nombre}
                                                </Card.Title>
                                                <Card.Text className="text-center">
                                                    <strong>Email:</strong> {usuario.email}<br />
                                                    <strong>Tipo:</strong> {usuario.tipo}
                                                </Card.Text>
                                            </div>
                                            <br />
                                            <div className="d-flex justify-content-center mt-auto">
                                                <Button
                                                    as={Link}
                                                    to={`/usuarios/${usuario.id}/editar`}
                                                    className="me-2 btn-user"
                                                >
                                                    <i className="fas fa-pencil-alt "></i>
                                                </Button>
                                                <Button
                                                    className="me-2 btn-usuario btn-user"
                                                    onClick={() => eliminar(usuario.id)}
                                                >
                                                    <i className="fas fa-trash "></i>
                                                </Button>
                                                <Button
                                                    as={Link}
                                                    to={`/usuarios/${usuario.id}/contraseña`}
                                                    className="btn-usuario btn-user"
                                                >
                                                    <i className="fas fa-lock"></i>
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default ListaUsuarios;
