import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleMap } from "@react-google-maps/api";
import useGoogleMapLoader from "../../utils/useGoogleMapLoader"; 
import { Button, Card, Container, Row, Col, Modal, Form } from "react-bootstrap";
import NavMenu from "../../../components/NavMenu";
import { obtenerUsuarioIdDesdeToken } from '../../utils/tokenUtils';

const ListaIncidentes = () => {
    const navigate = useNavigate();
    const [incidentes, setIncidentes] = useState([]);
    const [carreteras, setCarreteras] = useState([]);
    const [tiposIncidente, setTiposIncidente] = useState([]);
    const { isLoaded } = useGoogleMapLoader();
    const [showModal, setShowModal] = useState(false);
    const [selectedIncidente, setSelectedIncidente] = useState(null);
    const [imagen, setImagen] = useState(null);
    const [file, setFile] = useState(null);


    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = () => {
        axios
            .get("http://localhost:3000/incidentes")
            .then((res) => setIncidentes(res.data))
            .catch((error) => console.error("Error al obtener la lista de incidentes:", error));

        axios
            .get("http://localhost:3000/carreteras")
            .then((res) => setCarreteras(res.data))
            .catch((error) => console.error("Error al obtener la lista de carreteras:", error));

        axios
            .get("http://localhost:3000/tipos_incidente")
            .then((res) => setTiposIncidente(res.data))
            .catch((error) => console.error("Error al obtener la lista de tipos de incidente:", error));
    };

    const obtenerNombreCarretera = (carreteraId) => {
        const carretera = carreteras.find((c) => c.id === carreteraId);
        return carretera ? carretera.nombre : "Desconocida";
    };

    const obtenerNombreTipoIncidente = (tipoIncidenteId) => {
        const tipo = tiposIncidente.find((t) => t.id === tipoIncidenteId);
        return tipo ? tipo.nombre : "Desconocido";
    };

    const abrirModalImagen = (incidente) => {
        setSelectedIncidente(incidente);
        setImagen(`http://localhost:3000/incidentes/${incidente.id}.jpg`);
        setShowModal(true);
    };

    const cerrarModalImagen = () => {
        setShowModal(false);
        setFile(null);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };


    const subirImagen = () => {
        if (!file || !selectedIncidente) return;
    
        const formData = new FormData();
        formData.append("imagen", file);
    
        axios.post(`http://localhost:3000/incidentes/${selectedIncidente.id}/imagen`, formData)
            .then(() => {
                const usuarioId = obtenerUsuarioIdDesdeToken();
    
                axios.post("http://localhost:3000/historial", {
                    usuarioId: usuarioId,
                    accion: "Editar",
                    entidad: "Incidente (Foto)",
                    entidadId: selectedIncidente.id
                })
                .then(() => {
                    console.log("Acción de edición de imagen registrada en el historial.");
                })
                .catch((error) => {
                    console.error("Error al registrar la acción de edición de imagen en el historial:", error);
                });
    
                cargarDatos();
                cerrarModalImagen();
            })
            .catch((error) => console.error("Error al subir la imagen:", error));
    };

        const eliminarIncidente = (id) => {
            const confirm = window.confirm("¿Está seguro de que desea eliminar este incidente?");
            if (!confirm) return;
            const usuarioId = obtenerUsuarioIdDesdeToken();
            axios.delete(`http://localhost:3000/incidentes/${id}`)
                .then(() => {
                    axios.post("http://localhost:3000/historial", {
                        usuarioId: usuarioId,
                        accion: "Eliminar",
                        entidad: "Incidente",
                        entidadId: id
                    })
                    .then(() => {
                        console.log("Acción de eliminación registrada en el historial.");
                    })
                    .catch((error) => {
                        console.error("Error al registrar la acción de eliminación en el historial:", error);
                    });
        
                    cargarDatos(); 
                })
                .catch((error) => console.error("Error al eliminar el incidente:", error));
        };
    
return (
    <>
    <NavMenu />
    <Container className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="text-center">Lista de Incidentes</h2>
            <Button 
                className="btn-user" 
                onClick={() => navigate("/incidentes/crear")}
                >
                <i className="fas fa-plus me-2"></i> Agregar Incidente
            </Button>
        </div>
        <Row>
            {incidentes.map((incidente) => (
                <Col xs={12} sm={6} md={6} lg={4} className="mb-4" key={incidente.id}>
                    <Card className="fold-big-login">
                        <Card.Body>
                            <h5 className="mb-3 text-center">{obtenerNombreCarretera(incidente.carreteraId)}</h5>

                            <div className="mb-2">
                                <strong>Tipo de Incidente: </strong>
                                {obtenerNombreTipoIncidente(incidente.tipoIncidenteId)}
                            </div>

                            <div className="mb-2">
                                <strong>Descripción: </strong>
                                {incidente.descripcion || "Sin descripción"}
                            </div>

                            <div style={{ width: "100%", height: "200px" }} className="mb-3">
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={{ width: '100%', height: '100%' }}
                                        center={{ lat: incidente.lat, lng: incidente.long }}
                                        zoom={15}
                                        onLoad={(map) => {
                                            new window.google.maps.Circle({
                                                center: { lat: incidente.lat, lng: incidente.long },
                                                radius: 150,
                                                strokeColor: "#FFD700",
                                                strokeOpacity: 100,
                                                strokeWeight: 0,
                                                fillColor: "#FFD700",
                                                fillOpacity: 0.80,
                                                map: map,
                                            });
                                        }}
                                    />
                                ) : (
                                    <p>Cargando mapa...</p>
                                )}
                            </div>

                            <div className="d-flex justify-content-around">
                                <Button 
                                    className="btn-user" 
                                    onClick={() => abrirModalImagen(incidente)}
                                >
                                    <i className="fas fa-image me-2"></i>
                                    Imagen
                                </Button>
                                <Button 
                                    className="btn-user" 
                                    onClick={() => navigate(`/incidentes/${incidente.id}/editar`)}
                                >
                                    <i className="fas fa-pencil-alt me-2"></i>
                                    Editar
                                </Button>
                                <Button 
                                    className="btn-user" 
                                    onClick={() => eliminarIncidente(incidente.id)}
                                >
                                    <i className="fas fa-trash me-2"></i>
                                    Eliminar
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            ))}
        </Row>
    </Container>

    <Modal show={showModal} onHide={cerrarModalImagen} size="lg" centered >
        <Modal.Header closeButton>
            <Modal.Title>Gestión de Imagen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {imagen ? (
                <div className="text-center mb-4">
                    <img 
                        src={imagen} 
                        alt="Sin Imagen" 
                        style={{ maxWidth: '100%', maxHeight: '300px' }} 
                    />
                </div>
            ) : (
                <p className="text-center">No hay imagen cargada para este incidente</p>
            )}

            <Form.Group controlId="formFile" className="mb-3">
                <Form.Label>Seleccionar Imagen</Form.Label>
                <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>

            <div className="d-flex justify-content-between">
                <Button 
                    onClick={subirImagen} 
                    disabled={!file}
                    className="btn-tipo"
                >
                    Subir Imagen
                </Button>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button className="btn-tipo" onClick={cerrarModalImagen}>
                Cerrar
            </Button>
        </Modal.Footer>
    </Modal>
</>
);
};

export default ListaIncidentes;
