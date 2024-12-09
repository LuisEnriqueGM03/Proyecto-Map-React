import { useState, useEffect, useCallback } from "react";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, Polyline } from "@react-google-maps/api";
import axios from "axios";
import useGoogleMapLoader from "../../utils/useGoogleMapLoader";
import NavMenu from "../../../components/NavMenu";
import { obtenerUsuarioIdDesdeToken } from '../../utils/tokenUtils';

const containerStyle = {
    width: "100%",
    height: "500px",
};

const defaultCenter = {
    lat: -17.78302580071355,
    lng: -63.180359841218795,
};

const FormCarretera = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [nombre, setNombre] = useState("");
    const [municipioOrigen, setMunicipioOrigen] = useState("");
    const [municipioDestino, setMunicipioDestino] = useState("");
    const [estado, setEstado] = useState("Libre");
    const [descripcion, setDescripcion] = useState("");
    const [puntos, setPuntos] = useState([]);
    const [validated, setValidated] = useState(false);
    const [municipios, setMunicipios] = useState([]); 
    const [errorMunicipios, setErrorMunicipios] = useState("");
    const [center, setCenter] = useState(defaultCenter);
    const { isLoaded, error } = useGoogleMapLoader("AIzaSyBMMbGGDVksjtkj68iJ0sWyTM_2nfb-klg", ["drawing", "places"]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/municipios")
            .then((res) => {
                setMunicipios(res.data);
            })
            .catch((error) => {
                console.error("Error al obtener los municipios:", error);
            });
        if (id) {
            axios
                .get(`http://localhost:3000/carreteras/${id}`)
                .then((res) => {
                    const carretera = res.data;
                    setNombre(carretera.nombre);
                    setMunicipioOrigen(carretera.municipioOrigen);
                    setMunicipioDestino(carretera.municipioDestino);
                    setEstado(carretera.estado);
                    setDescripcion(carretera.descripcion);
                    return axios.get(`http://localhost:3000/puntos/${id}`);
                })
                .then((res) => {
                    setPuntos(res.data.polyline); 
                })
                .catch((error) => {
                    console.error("Error al cargar la carretera o sus puntos:", error);
                });
        }
    }, [id]);

    useEffect(() => {
        if (municipioOrigen && municipios.length > 0) {
            const municipio = municipios.find((m) => m.id === parseInt(municipioOrigen));
            if (municipio) {
                setCenter({ lat: municipio.lat, lng: municipio.long });
            }
        }
    }, [municipioOrigen, municipios]);

    const onMapClick = useCallback((event) => {
        const nuevoPunto = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
        };
        setPuntos((puntosAnteriores) => [...puntosAnteriores, nuevoPunto]);
    }, []);

    const onGuardarClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        setValidated(true);

        if (form.checkValidity() === false || municipioOrigen === municipioDestino) {
            setErrorMunicipios(
                municipioOrigen === municipioDestino
                    ? "El municipio de origen y destino no pueden ser el mismo."
                    : ""
            );
            return;
        }

        const carretera = {
            nombre,
            municipioOrigen: parseInt(municipioOrigen),
            municipioDestino: parseInt(municipioDestino),
            estado,
            descripcion,
        };

        const usuarioId = obtenerUsuarioIdDesdeToken();
        if (id) {
            axios
                .put(`http://localhost:3000/carreteras/${id}`, carretera)
                .then(() => {
                    const puntosData = { carreteraId: id, polyline: puntos };
                    return axios.put(`http://localhost:3000/puntos/${id}`, puntosData);
                })
                .then(() => {
                    axios.post("http://localhost:3000/historial", {
                        usuarioId: usuarioId,
                        accion: "Editar",
                        entidad: "Carretera",
                        entidadId: id
                    })
                    .then(() => {
                        console.log("Acción de edición registrada en el historial.");
                    })
                    .catch((error) => {
                        console.error("Error al registrar la acción de edición en el historial:", error);
                    });
    
                    navigate("/carretera");
                })
                .catch((error) => {
                    console.error("Error al actualizar la carretera o los puntos:", error);
                });
        } else {
            axios
                .post("http://localhost:3000/carreteras", carretera)
                .then((res) => {
                    const carreteraId = res.data.id;
                    const puntosData = { carreteraId, polyline: puntos };
                    return axios.post("http://localhost:3000/puntos", puntosData)
                        .then(() => carreteraId);
                })
                .then((carreteraId) => {
                    axios.post("http://localhost:3000/historial", {
                        usuarioId: usuarioId,
                        accion: "Crear",
                        entidad: "Carretera",
                        entidadId: carreteraId
                    })
                    .then(() => {
                        console.log("Acción de creación registrada en el historial.");
                    })
                    .catch((error) => {
                        console.error("Error al registrar la acción de creación en el historial:", error);
                    });
    
                    navigate("/carretera");
                })
                .catch((error) => {
                    console.error("Error al crear la carretera o los puntos:", error);
                });
        }
    };
    const eliminarUltimoPunto = () => {
        setPuntos((puntosAnteriores) => puntosAnteriores.slice(0, -1));
    };

    const eliminarDibujoCompleto = () => {
        setPuntos([]);
    };

    if (error) {
        return <div>{error}</div>; 
    }

    return (
        <>
        <NavMenu/>
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "170vh" }}>
                <Card className="p-4 fold-big-login" style={{ width: "900px" }}>
                    <Card.Body>
                        <h2 className="mb-4 text-center">{id ? "Editar Carretera" : "Crear Carretera"}</h2>
                        <Form noValidate validated={validated} onSubmit={onGuardarClick}>

                            <Form.Group controlId="formNombre" className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el nombre de la carretera"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor, ingrese el nombre de la carretera.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <Row className="mb-3">
                                <Col>
                                    <Form.Group controlId="formMunicipioOrigen">
                                        <Form.Label>Municipio Origen</Form.Label>
                                        <Form.Select
                                            value={municipioOrigen}
                                            onChange={(e) => setMunicipioOrigen(e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccione un municipio</option>
                                            {municipios.map((municipio) => (
                                                <option key={municipio.id} value={municipio.id}>
                                                    {municipio.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="formMunicipioDestino">
                                        <Form.Label>Municipio Destino</Form.Label>
                                        <Form.Select
                                            value={municipioDestino}
                                            onChange={(e) => setMunicipioDestino(e.target.value)}
                                            required
                                        >
                                            <option value="">Seleccione un municipio</option>
                                            {municipios.map((municipio) => (
                                                <option key={municipio.id} value={municipio.id}>
                                                    {municipio.nombre}
                                                </option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>

                            {errorMunicipios && <p className="text-danger">{errorMunicipios}</p>}

                            <Form.Group controlId="formEstado" className="mb-3">
                                <Form.Label>Estado</Form.Label>
                                <Form.Select
                                    value={estado}
                                    onChange={(e) => setEstado(e.target.value)}
                                    required
                                >
                                    <option value="Libre">Libre</option>
                                    <option value="Bloqueada">Bloqueada</option>
                                </Form.Select>
                            </Form.Group>

                            <Form.Group controlId="formDescripcion" className="mb-3">
                                <Form.Label>Descripción</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Ingrese la descripción de la carretera"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                />
                            </Form.Group>

                            <div className="mb-4">
                                {isLoaded ? (
                                    <GoogleMap
                                        mapContainerStyle={containerStyle}
                                        center={center} 
                                        zoom={12}
                                        onClick={onMapClick} 
                                    >
                                        {puntos.length > 0 && (
                                            <Polyline
                                                path={puntos}
                                                options={{
                                                    strokeColor: estado === "Libre" ? "#006400" : "#FF0000",
                                                    strokeOpacity: 0.8,
                                                    strokeWeight: 4,
                                                    clickable: false,
                                                    draggable: false,
                                                    editable: false,
                                                    geodesic: false,
                                                }}
                                            />
                                        )}
                                    </GoogleMap>
                                ) : (
                                    <div>Cargando mapa...</div>
                                )}
                            </div>

                            <div className="d-flex justify-content-center">
                                <Button
                                    variant="secondary"
                                    onClick={eliminarUltimoPunto}
                                    disabled={puntos.length === 0}
                                    className="btn-tipo me-2"
                                >
                                    Eliminar Último Punto
                                </Button>

                                <Button
                                    variant="warning"
                                    onClick={eliminarDibujoCompleto}
                                    disabled={puntos.length === 0}
                                    className="btn-tipo me-2"
                                >
                                    Eliminar Todo el Dibujo
                                </Button>

                                <Button
                                    variant="primary"
                                    type="submit"
                                    className="btn-tipo"
                                >
                                    Guardar Carretera
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default FormCarretera;
