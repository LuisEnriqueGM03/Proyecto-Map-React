import { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import useGoogleMapLoader from "../../utils/useGoogleMapLoader"; 
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import NavMenu from "../../../components/NavMenu";
import { obtenerUsuarioIdDesdeToken } from '../../utils/tokenUtils';

const FormIncidentes = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [carreteraId, setCarreteraId] = useState("");
    const [tipoIncidenteId, setTipoIncidenteId] = useState("");
    const [descripcion, setDescripcion] = useState("");
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [center, setCenter] = useState({ lat: -17.78302580071355, lng: -63.180359841218795 });
    const [userClicked, setUserClicked] = useState(false);
    const [carreteras, setCarreteras] = useState([]);
    const [tiposIncidente, setTiposIncidente] = useState([]);
    const [polyline, setPolyline] = useState([]);
    const [validated, setValidated] = useState(false);
    const { isLoaded } = useGoogleMapLoader();
    
    
    const mapRef = useRef(null);
    const circleRef = useRef(null);

    useEffect(() => {
        cargarListas();
        if (id) {
            axios
                .get(`http://localhost:3000/incidentes/${id}`)
                .then((res) => {
                    const incidente = res.data;
                    setCarreteraId(incidente.carreteraId);
                    setTipoIncidenteId(incidente.tipoIncidenteId);
                    setDescripcion(incidente.descripcion);
                    setLat(incidente.lat);
                    setLong(incidente.long);
                    setUserClicked(true);
                    cargarPuntosCarretera(incidente.carreteraId);
                })
                .catch((error) => {
                    console.error("Error al cargar el incidente:", error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (lat && long && mapRef.current) {
            if (circleRef.current) {
                circleRef.current.setMap(null); 
            }

            const nuevoCirculo = new window.google.maps.Circle({
                center: { lat, lng: long },
                radius: 150,
                strokeColor: "#FFD700",
                strokeOpacity: 100,
                strokeWeight: 0,
                fillColor: "#FFD700",
                fillOpacity: 0.80,
                map: mapRef.current,
            });

            circleRef.current = nuevoCirculo; 
        }
    }, [lat, long, mapRef.current]);

    const cargarListas = () => {
        axios
            .get("http://localhost:3000/carreteras")
            .then((res) => setCarreteras(res.data))
            .catch((error) => console.error("Error al obtener la lista de carreteras:", error));

        axios
            .get("http://localhost:3000/tipos_incidente")
            .then((res) => setTiposIncidente(res.data))
            .catch((error) => console.error("Error al obtener la lista de tipos de incidentes:", error));
    };

    const handleCarreteraChange = (e) => {
        const selectedCarreteraId = e.target.value;
        setCarreteraId(selectedCarreteraId);
        setLat(null);
        setLong(null);
        if (circleRef.current) {
            circleRef.current.setMap(null); 
            circleRef.current = null;
        }
        cargarPuntosCarretera(selectedCarreteraId);
    };

    const cargarPuntosCarretera = (carreteraId) => {
        if (!carreteraId) return;

        axios
            .get(`http://localhost:3000/puntos/${carreteraId}`)
            .then((res) => {
                const puntos = res.data.polyline;
                setPolyline(puntos);
                if (puntos.length > 0) {
                    setCenter({ lat: puntos[0].lat, lng: puntos[0].lng });
                }
            })
            .catch((error) => console.error(`Error al obtener los puntos de la carretera ${carreteraId}:`, error));
    };

    const onMapLoad = (map) => {
        mapRef.current = map;
    };

    const borrarPunto = () => {
        if (circleRef.current) {
            circleRef.current.setMap(null); 
            circleRef.current = null; 
        }
        setLat(null);
        setLong(null);
        setUserClicked(false);
    };

    const onMapClick = useCallback((event) => {
        if (userClicked) return; 

        const nuevaLat = event.latLng.lat();
        const nuevaLong = event.latLng.lng();

        setLat(nuevaLat);
        setLong(nuevaLong);
        setUserClicked(true);
    }, [userClicked]);

    const onGuardarClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const incidente = {
            carreteraId: parseInt(carreteraId),
            tipoIncidenteId: parseInt(tipoIncidenteId),
            descripcion,
            lat,
            long
        };


        if (id) {
            axios
                .put(`http://localhost:3000/incidentes/${id}`, incidente)
                .then(() => {
                    const usuarioId = obtenerUsuarioIdDesdeToken();
        
                    axios.post("http://localhost:3000/historial", {
                        usuarioId: usuarioId,
                        accion: "Editar",
                        entidad: "Incidente",
                        entidadId: id
                    })
                    .then(() => {
                        console.log("Acción de edición de incidente registrada en el historial.");
                    })
                    .catch((error) => {
                        console.error("Error al registrar la acción de edición de incidente en el historial:", error);
                    });
        
                    navigate("/incidentes");
                })
                .catch((error) => console.error("Error al actualizar el incidente:", error));
        } else {
            axios
                .post("http://localhost:3000/incidentes", incidente)
                .then((res) => {
                    const incidenteId = res.data.id; 
                    
                    const usuarioId = obtenerUsuarioIdDesdeToken();
        
                    axios.post("http://localhost:3000/historial", {
                        usuarioId: usuarioId,
                        accion: "Crear",
                        entidad: "Incidente",
                        entidadId: incidenteId
                    })
                    .then(() => {
                        console.log("Acción de creación de incidente registrada en el historial.");
                    })
                    .catch((error) => {
                        console.error("Error al registrar la acción de creación de incidente en el historial:", error);
                    });
        
                    navigate("/incidentes");
                })
                .catch((error) => console.error("Error al crear el incidente:", error));
        }        
    };


return (
    <>
    <NavMenu />
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "170vh" }}>
            <Card className="p-4 fold-big-login" style={{ width: "900px" }}>
                <Card.Body>
                    <h2 className="mb-4 text-center">{id ? "Editar Incidente" : "Crear Incidente"}</h2>
                    <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                        
                        <Form.Group controlId="formCarretera" className="mb-3">
                            <Form.Label>Carretera</Form.Label>
                            <Form.Select
                                value={carreteraId}
                                onChange={handleCarreteraChange}
                                required
                            >
                                <option value="">Seleccione una carretera</option>
                                {carreteras.map((carretera) => (
                                    <option key={carretera.id} value={carretera.id}>
                                        {carretera.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Por favor, seleccione una carretera.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formTipoIncidente" className="mb-3">
                            <Form.Label>Tipo de Incidente</Form.Label>
                            <Form.Select
                                value={tipoIncidenteId}
                                onChange={(e) => setTipoIncidenteId(e.target.value)}
                                required
                            >
                                <option value="">Seleccione un tipo de incidente</option>
                                {tiposIncidente.map((tipo) => (
                                    <option key={tipo.id} value={tipo.id}>
                                        {tipo.nombre}
                                    </option>
                                ))}
                            </Form.Select>
                            <Form.Control.Feedback type="invalid">
                                Por favor, seleccione un tipo de incidente.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formDescripcion" className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Ingrese la descripción del incidente"
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                            />
                        </Form.Group>

                        <Row className="mb-4">
                            <Col>
                                <Form.Group controlId="formLat">
                                    <Form.Label>Latitud</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Latitud"
                                        value={lat || ""}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="formLong">
                                    <Form.Label>Longitud</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Longitud"
                                        value={long || ""}
                                        readOnly
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <div className="mb-4">
                            {isLoaded ? (
                                <GoogleMap
                                    mapContainerStyle={{ width: '100%', height: '400px' }}
                                    center={lat && long ? { lat, lng: long } : center}
                                    zoom={lat && long ? 15 : 12}
                                    onClick={onMapClick}
                                    onLoad={onMapLoad} 
                                >
                                    {polyline.length > 0 && (
                                        <Polyline
                                            path={polyline}
                                            options={{
                                                strokeColor: "#006400",
                                                strokeOpacity: 0.8,
                                                strokeWeight: 4,
                                                clickable: false,
                                                draggable: false,
                                                editable: false,
                                                geodesic: true,
                                            }}
                                        />
                                    )}
                                </GoogleMap>
                            ) : (
                                <p>Cargando mapa...</p>
                            )}
                        </div>

                        <div className="d-flex justify-content-between">
                            <Button variant="danger" onClick={borrarPunto} disabled={!lat || !long} className="btn-tipo">
                                Borrar Punto
                            </Button>
                            <Button variant="primary" type="submit" className="btn-tipo">
                                {id ? "Guardar Cambios" : "Guardar Incidente"}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    </>
);
};

export default FormIncidentes;