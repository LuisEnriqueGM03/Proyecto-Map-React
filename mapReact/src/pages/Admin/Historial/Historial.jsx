import { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import NavMenu from "../../../components/NavMenu";

const ListaHistorial = () => {
    const [historial, setHistorial] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        axios
            .get("http://localhost:3000/historial")
            .then((res) => {
                setHistorial(res.data);
            })
            .catch((error) => console.error("Error al obtener la lista de historial:", error));

        axios
            .get("http://localhost:3000/usuarios")
            .then((res) => setUsuarios(res.data))
            .catch((error) => console.error("Error al obtener la lista de usuarios:", error));
    };

    const obtenerNombreUsuario = (usuarioId) => {
        const usuario = usuarios.find((u) => u.id === usuarioId);
        return usuario ? usuario.nombre : "Desconocido";
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-4">
                <h2 className="text-center mb-4">Historial de Acciones</h2>
                <Row>
                    {historial.map((item) => (
                        <Col xs={12} sm={6} md={6} lg={4} className="mb-4" key={item.id}>
                            <Card className="h-100 fold-big-login">
                                <Card.Body>
                                    <h5 className="mb-3 text-center">Usuario: {obtenerNombreUsuario(item.usuarioId)}</h5>

                                    <div className="mb-2">
                                        <strong>Acción: </strong>
                                        <span>{item.accion}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Fecha: </strong>
                                        <span>{new Date(item.fecha).toLocaleString()}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>Entidad: </strong>
                                        <span>{item.entidad}</span>
                                    </div>

                                    <div className="mb-2">
                                        <strong>ID de la Entidad: </strong>
                                        <span>{item.entidadId}</span>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </>
    );
};

export default ListaHistorial;
