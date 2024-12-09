import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Container, Row, Button, Form } from "react-bootstrap";
import NavMenu from "../../../components/NavMenu.jsx";
import { obtenerUsuarioIdDesdeToken } from '../../utils/tokenUtils';

const ListaSolicitudes = () => {
    const [solicitudes, setSolicitudes] = useState([]);
    const [filtroEstado, setFiltroEstado] = useState(""); 

    useEffect(() => {
        getListaSolicitudes();
        document.title = "Lista de Solicitudes de Incidentes";
    }, []);

    const getListaSolicitudes = () => {
        axios
            .get("http://localhost:3000/solicitudes_incidente")
            .then((res) => {
                setSolicitudes(res.data);
            })
            .catch((error) => {
                console.error("Error al obtener las solicitudes:", error);
            });
    };

    const cambiarEstadoSolicitud = (id, nuevoEstado) => {
        axios
            .put(`http://localhost:3000/solicitudes_incidente/${id}`, { estado: nuevoEstado })
            .then(() => {
                const usuarioId = obtenerUsuarioIdDesdeToken();
                axios.post("http://localhost:3000/historial", {
                    usuarioId: usuarioId,
                    accion: "Editar",
                    entidad: `Solicitud(${nuevoEstado})`,
                    entidadId: id
                })
                .then(() => {
                    console.log("Acción de cambio de estado de la solicitud registrada en el historial.");
                })
                .catch((error) => {
                    console.error("Error al registrar la acción de cambio de estado de la solicitud en el historial:", error);
                });
    
                getListaSolicitudes(); 
            })
            .catch((error) => {
                console.error(`Error al cambiar el estado de la solicitud ${id}:`, error);
            });
    };
    const eliminarSolicitud = (id) => {
        const confirm = window.confirm("¿Está seguro de que desea eliminar esta solicitud?");
        if (!confirm) return;
    
        axios
            .delete(`http://localhost:3000/solicitudes_incidente/${id}`)
            .then(() => {
                const usuarioId = obtenerUsuarioIdDesdeToken();
    
                axios.post("http://localhost:3000/historial", {
                    usuarioId: usuarioId,
                    accion: "Eliminar",
                    entidad: "Solicitud",
                    entidadId: id
                })
                .then(() => {
                    console.log("Acción de eliminación de la solicitud registrada en el historial.");
                })
                .catch((error) => {
                    console.error("Error al registrar la acción de eliminación de la solicitud en el historial:", error);
                });
    
                getListaSolicitudes(); 
            })
            .catch((error) => {
                console.error(`Error al eliminar la solicitud ${id}:`, error);
            });
    };

    const handleFiltroChange = (e) => {
        setFiltroEstado(e.target.value);
    };

    const solicitudesFiltradas = solicitudes.filter((solicitud) => 
        filtroEstado === "" || solicitud.estado === filtroEstado
    );

    const getColorDeEstado = (estado) => {
        switch (estado) {
            case "Pendiente":
                return "#d6d6d6"; 
            case "Aprobada":
                return "#4CBB17"; 
            case "Rechazada":
                return "#FE2020"; 
            default:
                return "#FFFFFF"; 
        }
    };

    return (
        <>
            <NavMenu />
            <Container className="mt-4">
                <Card className="p-4 fold-big">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="mb-0">Lista de Solicitudes de Incidentes</h2>

                            <Form.Select 
                                value={filtroEstado} 
                                onChange={handleFiltroChange} 
                                style={{ width: "200px" }}
                            >
                                <option value="">Todos</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Aprobada">Aprobada</option>
                                <option value="Rechazada">Rechazada</option>
                            </Form.Select>
                        </div>

                        <Row>
                            {solicitudesFiltradas.map((solicitud) => (
                                <Col xs={12} sm={6} md={6} lg={6} key={solicitud.id} className="mb-4">
                                    <Card 
                                        className="fold-tipo"
                                        style={{ backgroundColor: getColorDeEstado(solicitud.estado) }}
                                    >
                                        <Card.Body>
                                            <h5 className="mb-3 text-center">Solicitud #{solicitud.id}</h5>

                                            <div className="mb-2">
                                                <strong>Descripción: </strong>
                                                {solicitud.descripcion}
                                                <br />
                                                <strong>Fecha: </strong>
                                                <span>{new Date(solicitud.fecha).toLocaleString()}</span>
                                            </div>

                                            <div className="text-center">
                                                <img
                                                    className="img-fluid rounded"
                                                    src={`http://localhost:3000/solicitudes/${solicitud.id}.jpg`}
                                                    alt={`Imagen de la solicitud ${solicitud.id}`}
                                                    style={{ maxWidth: "100%", maxHeight: "200px", objectFit: "cover" }}
                                                />
                                            </div>

                                            <div className="d-flex flex-wrap justify-content-center mt-3 gap-2">
                                                <Button 
                                                    onClick={() => cambiarEstadoSolicitud(solicitud.id, "Pendiente")} 
                                                    className="btn-user btn-secondary"
                                                    disabled={solicitud.estado === "Pendiente"}
                                                >
                                                    <i className="fas fa-clock me-2"></i> Pendiente
                                                </Button>

                                                <Button 
                                                    onClick={() => cambiarEstadoSolicitud(solicitud.id, "Aprobada")} 
                                                    className="btn-user btn-success"
                                                    disabled={solicitud.estado === "Aprobada"}
                                                >
                                                    <i className="fas fa-check me-2"></i> Aprobar
                                                </Button>

                                                <Button 
                                                    onClick={() => cambiarEstadoSolicitud(solicitud.id, "Rechazada")} 
                                                    className="btn-user btn-danger"
                                                    disabled={solicitud.estado === "Rechazada"}
                                                >
                                                    <i className="fas fa-times me-2"></i> Rechazar
                                                </Button>

                                                <Button 
                                                    onClick={() => eliminarSolicitud(solicitud.id)} 
                                                    className="btn-user "
                                                >
                                                    <i className="fas fa-trash-alt me-2"></i> Eliminar
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

export default ListaSolicitudes;
