import { useEffect, useState } from "react";
import axios from "axios";
import { Button, Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import '@fortawesome/fontawesome-free/css/all.min.css';
import NavMenu from "../../../components/NavMenu.jsx";

const TiposIncidentes = () => {
    const [tiposIncidentes, setTiposIncidentes] = useState([]);

    useEffect(() => {
        getListaTiposIncidentes();
        document.title = "Lista de Tipos de Incidentes";
    }, []);

    const getListaTiposIncidentes = () => {
        axios.get('http://localhost:3000/tipos_incidente')
            .then(res => {
                setTiposIncidentes(res.data);
            })
            .catch(error => {
                console.log("Error al obtener los tipos de incidentes:", error);
            });
    };

    const eliminar = (id) => {
        const confirm = window.confirm("¿Está seguro de eliminar el tipo de incidente?");
        if (!confirm) return;

        axios.delete(`http://localhost:3000/tipos_incidente/${id}`)
            .then(() => {
                getListaTiposIncidentes();
            })
            .catch(error => {
                console.log("Error al eliminar el tipo de incidente:", error);
            });
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-4">
                <Card className="p-4 fold-big">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="mb-0">Lista de Tipos de Incidentes</h2>
                            <Button as={Link} to="/tiposincidentes/crear" className="btn-user">
                                <i className="fas fa-plus me-2"></i> Agregar Tipo
                            </Button>
                        </div>

                        <Row>
                            {tiposIncidentes.map((tipo) => (
                                <Col xs={12} sm={6} md={4} lg={3} key={tipo.id} className="mb-4">
                                    <Card className="fold-tipo-card">
                                        <Card.Body className="d-flex flex-column align-items-center">
                                            <Card.Title className="nombre mb-3 text-center ">
                                                {tipo.nombre}
                                            </Card.Title>

                                            <div className="d-flex justify-content-center">
                                                <Button
                                                    as={Link}
                                                    to={`/tipos_incidentes/${tipo.id}/editar`}
                                                    className="me-2 btn-user"
                                                >
                                                    <i className="fas fa-pencil-alt"></i>
                                                </Button>
                                                <Button
                                                    className="btn-user"
                                                    onClick={() => eliminar(tipo.id)}
                                                >
                                                    <i className="fas fa-trash"></i>
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

export default TiposIncidentes;
