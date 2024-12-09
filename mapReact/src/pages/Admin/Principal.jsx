import { useEffect, useState } from "react";
import axios from "axios";
import { GoogleMap, MarkerF, PolylineF, CircleF } from "@react-google-maps/api";
import useGoogleMapLoader from "../utils/useGoogleMapLoader";
import { Button, Card, Container, Row, Col, Form, Modal } from "react-bootstrap";
import NavMenu from "../../components/NavMenu";

const Principal = () => {
    const [municipios, setMunicipios] = useState([]);
    const [carreteras, setCarreteras] = useState([]);
    const [tiposIncidente, setTiposIncidente] = useState([]);
    const [tipoSeleccionado, setTipoSeleccionado] = useState("ninguno");
    const [carreteraResaltada, setCarreteraResaltada] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [incidenteSeleccionado, setIncidenteSeleccionado] = useState(null);
    const [imagen, setImagen] = useState(null);
    const { isLoaded } = useGoogleMapLoader();
    const [showReporteModal, setShowReporteModal] = useState(false);
    const [descripcionReporte, setDescripcionReporte] = useState("");
    const [imagenReporte, setImagenReporte] = useState(null);
    const [validatedReporte, setValidatedReporte] = useState(false);
    const [loadingReporte, setLoadingReporte] = useState(false);


    useEffect(() => {
        cargarMunicipios();
        cargarCarreteras();
        cargarTiposIncidente();
        document.title = "Map Bolivia";
    }, []);

    const cargarMunicipios = () => {
        axios
            .get("http://localhost:3000/municipios")
            .then((res) => setMunicipios(res.data))
            .catch((error) => console.error("Error al cargar municipios:", error));
    };

    const cargarCarreteras = () => {
        axios
            .get("http://localhost:3000/carreteras")
            .then(async (res) => {
                const carreteras = res.data;
                const carreterasConPuntos = await Promise.all(
                    carreteras.map(async (carretera) => {
                        const puntosRes = await axios.get(`http://localhost:3000/puntos/${carretera.id}`);
                        return {
                            ...carretera,
                            polyline: puntosRes.data.polyline,
                        };
                    })
                );
                setCarreteras(carreterasConPuntos);
            })
            .catch((error) => console.error("Error al cargar carreteras:", error));
    };

    const cargarTiposIncidente = () => {
        axios
            .get("http://localhost:3000/tipos_incidente")
            .then((res) => setTiposIncidente(res.data))
            .catch((error) => console.error("Error al cargar tipos de incidente:", error));
    };

    const manejarFiltroTipo = (idTipo) => {
        if (tipoSeleccionado === idTipo) {
            setTipoSeleccionado("ninguno");
        } else {
            setTipoSeleccionado(idTipo);
        }
    };

    const cargarCarreterasPorTipo = async (idTipo) => {
        if (idTipo === "ninguno") {
            cargarCarreteras();
        } else {
            try {
                const res = await axios.get(`http://localhost:3000/incidentes/tipo/${idTipo}`);
                const carreterasMap = new Map();

                res.data.forEach((incidente) => {
                    const carreteraId = incidente.carretera.id;
                    if (!carreterasMap.has(carreteraId)) {
                        carreterasMap.set(carreteraId, {
                            ...incidente.carretera,
                            polyline: [],
                            estado: incidente.carretera.estado,
                        });
                    }
                });

                const carreterasConPuntos = await Promise.all(
                    Array.from(carreterasMap.values()).map(async (carretera) => {
                        const puntosRes = await axios.get(`http://localhost:3000/puntos/${carretera.id}`);
                        return {
                            ...carretera,
                            polyline: puntosRes.data.polyline,
                        };
                    })
                );

                setCarreteras(carreterasConPuntos);
            } catch (error) {
                console.error("Error al cargar carreteras por tipo de incidente:", error);
            }
        }
    };


    useEffect(() => {
        cargarCarreterasPorTipo(tipoSeleccionado);
    }, [tipoSeleccionado]);

    const resaltarCarretera = async (carretera) => {
        try {
            const puntosRes = await axios.get(`http://localhost:3000/puntos/${carretera.id}`);
            const municipioOrigen = municipios.find(municipio => municipio.id === carretera.municipioOrigen);
            const municipioDestino = municipios.find(municipio => municipio.id === carretera.municipioDestino);

            setCarreteraResaltada({
                ...carretera,
                polyline: puntosRes.data.polyline,
                origenMarker: municipioOrigen ? { lat: municipioOrigen.lat, lng: municipioOrigen.long } : null,
                destinoMarker: municipioDestino ? { lat: municipioDestino.lat, lng: municipioDestino.long } : null,
            });

            setCarreteras([
                {
                    ...carretera,
                    polyline: puntosRes.data.polyline,
                }
            ]);

            const municipiosFiltrados = municipios.filter(municipio =>
                municipio.id === carretera.municipioOrigen || municipio.id === carretera.municipioDestino
            );
            setMunicipios(municipiosFiltrados);

        } catch (error) {
            console.error("Error al resaltar la carretera:", error);
        }
    };

    const limpiarResaltado = async () => {
        try {
            setTipoSeleccionado("ninguno");
            await cargarCarreteras();
            await cargarMunicipios();
            setCarreteraResaltada(null);
        } catch (error) {
            console.error("Error al limpiar el resaltado:", error);
        }
    };



    const verMotivo = async (carretera) => {
        try {
            const res = await axios.get(`http://localhost:3000/incidentes/carretera/${carretera.id}`);
            const incidente = res.data.length > 0 ? res.data[0] : null;

            if (incidente) {
                setIncidenteSeleccionado(incidente);
                const imageUrl = `http://localhost:3000/incidentes/${incidente.id}.jpg`;
                setImagen(imageUrl);

                const puntosRes = await axios.get(`http://localhost:3000/puntos/${carretera.id}`);
                const polyline = puntosRes.data.polyline;

                setCarreteraResaltada({
                    ...carretera,
                    polyline: polyline,
                });
            } else {
                setIncidenteSeleccionado(null);
                setImagen(null);
            }

            setShowModal(true);
        } catch (error) {
            console.error("Error al obtener el incidente por carretera:", error);
        }
    };



    const cerrarModalImagen = () => {
        setShowModal(false);
        setIncidenteSeleccionado(null);
        setImagen(null);
    };

    const getPolylineColor = (estado) => {
        switch (estado) {
            case "Bloqueada":
                return "#FF0000"; 
            case "Libre":
                return "#00FF00"; 
            default:
                return "#0000FF"; 
        }
    };

    const cerrarModalReporte = () => {
        setShowReporteModal(false);
        setDescripcionReporte("");
        setImagenReporte(null);
        setValidatedReporte(false);
        setLoadingReporte(false);
    };
    const onImageChangeReporte = (e) => {
        const file = e.target.files[0];
        setImagenReporte(file);
    };

    const onGuardarReporteClick = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        setValidatedReporte(true);

        if (form.checkValidity() === false) {
            return;
        }

        setLoadingReporte(true);
        try {
            const response = await axios.post("http://localhost:3000/solicitudes_incidente", {
                descripcion: descripcionReporte,
            });

            const solicitudId = response.data.id; 

            if (imagenReporte) {
                const formData = new FormData();
                formData.append("imagen", imagenReporte);

                await axios.post(`http://localhost:3000/solicitudes_incidente/${solicitudId}/imagen`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    }
                });
            }

            cerrarModalReporte(); 
        } catch (error) {
            console.error("Error al crear la solicitud o subir la imagen:", error);
        } finally {
            setLoadingReporte(false); 
        }
    };
    return (
        <>
            <NavMenu />
            <Container className="mt-4">
                <Card className="p-4 fold-big-map">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h2 className="mb-0">Mapa de Bolivia</h2>
                        </div>

                        <Row>
                            <Col md={8}>
                                <div style={{ width: "100%", height: "600px" }}>
                                    {isLoaded ? (
                                        <GoogleMap
                                            mapContainerStyle={{ width: "100%", height: "100%" }}
                                            center={{ lat: -16.290154, lng: -63.588653 }}
                                            zoom={6}
                                        >
                                            {municipios.map((municipio) => (
                                                <MarkerF
                                                    key={municipio.id}
                                                    position={{ lat: municipio.lat, lng: municipio.long }}
                                                    title={municipio.nombre}
                                                    icon={{
                                                        url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                                                        scaledSize: new window.google.maps.Size(40, 40),
                                                    }}
                                                />
                                            ))}

                                            {carreteras.map((carretera) => (
                                                <PolylineF
                                                    key={carretera.id}
                                                    path={carretera.polyline}
                                                    options={{
                                                        strokeColor: getPolylineColor(carretera.estado),
                                                        strokeOpacity: 0.8,
                                                        strokeWeight: 4,
                                                    }}
                                                />
                                            ))}
                                        </GoogleMap>
                                    ) : (
                                        <p>Cargando mapa...</p>
                                    )}
                                </div>
                            </Col>

                            <Col md={4}>
                                <Card className="mb-3 fold-big-map">
                                    <Card.Body>
                                        <h5 className="mb-3">Tipos de Incidentes</h5>
                                        <Form>
                                            <Form.Check
                                                type="radio"
                                                label="Ninguno"
                                                checked={tipoSeleccionado === "ninguno"}
                                                onChange={() => manejarFiltroTipo("ninguno")}
                                                disabled={!!carreteraResaltada} 
                                            />
                                            {tiposIncidente.map((tipo) => (
                                                <Form.Check
                                                    key={tipo.id}
                                                    type="radio"
                                                    label={tipo.nombre}
                                                    checked={tipoSeleccionado === tipo.id}
                                                    onChange={() => manejarFiltroTipo(tipo.id)}
                                                    disabled={!!carreteraResaltada}
                                                />
                                            ))}
                                        </Form>
                                    </Card.Body>
                                </Card>
                            </Col>

                        </Row>

                        <h4 className="mt-4 d-flex justify-content-between align-items-center">
                            Lista de Carreteras
                            <Button
                                variant="secondary"
                                onClick={limpiarResaltado}
                                className="btn-tipo"
                            >
                                ✖️
                                Limpiar Resaltado
                            </Button>
                        </h4>

                        <Row>
                            {carreteras.map((carretera) => {
                                const municipioOrigen = municipios.find(municipio => municipio.id === carretera.municipioOrigen);
                                const municipioDestino = municipios.find(municipio => municipio.id === carretera.municipioDestino);

                                return (
                                    <Col md={12} key={carretera.id} className="mb-3">
                                        <Card className="fold-big-map">
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <strong>Nombre:</strong> {carretera.nombre} <br />
                                                        <strong>Origen:</strong> {municipioOrigen ? municipioOrigen.nombre : 'Desconocido'} <br />
                                                        <strong>Destino:</strong> {municipioDestino ? municipioDestino.nombre : 'Desconocido'} <br />
                                                        <strong>Estado: {" "}</strong>
                                                        <span
                                                            className={
                                                                carretera.estado === "Bloqueada"
                                                                    ? "text-danger"
                                                                    : "text-success"
                                                            }
                                                        >
                                                            {carretera.estado}
                                                        </span>
                                                    </Col>
                                                    <Col md={6} className="text-end">

                                                        {carretera.estado === "Bloqueada" && (
                                                            <Button variant="danger" className="me-2 btn-tipo" onClick={() => verMotivo(carretera)}>
                                                            ☢️ Ver Motivo
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="primary"
                                                            onClick={() => {
                                                                resaltarCarretera(carretera);
                                                            }}
                                                            className="btn-tipo"
                                                        >
                                                            🛣️ Ver Carretera
                                                        </Button>
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                );
                            })}
                        </Row>

                    </Card.Body>
                </Card>
            </Container>

            <Modal show={showModal} onHide={cerrarModalImagen} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Detalle del Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{ width: '100%', height: '400px', marginBottom: '20px' }}>
                        {isLoaded ? (
                            <GoogleMap
                                mapContainerStyle={{ width: "100%", height: "100%" }}
                                center={{ lat: incidenteSeleccionado?.lat || -16.290154, lng: incidenteSeleccionado?.long || -63.588653 }}
                                zoom={15}
                            >
                                {incidenteSeleccionado && (
                                    <CircleF
                                        center={{ lat: incidenteSeleccionado.lat, lng: incidenteSeleccionado.long }}
                                        radius={150}
                                        options={{
                                            strokeColor: "#FFD700",
                                            strokeOpacity: 0.8,
                                            strokeWeight: 2,
                                            fillColor: "#FFD700",
                                            fillOpacity: 0.35,
                                        }}
                                    />
                                )}

                                {carreteraResaltada && carreteraResaltada.polyline && (
                                    <PolylineF
                                        path={carreteraResaltada.polyline}
                                        options={{
                                            strokeColor: "#FF0000",
                                            strokeOpacity: 0.8,
                                            strokeWeight: 5,
                                        }}
                                    />
                                )}
                            </GoogleMap>
                        ) : (
                            <p>Cargando mapa...</p>
                        )}
                    </div>

                    {imagen ? (
                        <div className="text-center">
                            <img
                                src={imagen}
                                alt="Imagen del Incidente"
                                style={{ maxWidth: '100%', maxHeight: '300px' }}
                            />
                        </div>
                    ) : (
                        <p className="text-center">No hay imagen disponible para este incidente</p>
                    )}

                    {incidenteSeleccionado && (
                        <>
                            <div className="mt-4">
                                <strong>Tipo de Incidente:</strong> {incidenteSeleccionado.tipoIncidente?.nombre || "Desconocido"}
                            </div>
                            <div className="mt-2">
                                <strong>Descripción:</strong> {incidenteSeleccionado.descripcion || "Sin descripción"}
                            </div>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-tipo" onClick={cerrarModalImagen}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>


            <Modal show={showReporteModal} onHide={cerrarModalReporte} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Reportar Incidente</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form noValidate validated={validatedReporte} onSubmit={onGuardarReporteClick}>
                        <Form.Group controlId="formDescripcion" className="mb-3">
                            <Form.Label>Descripcion</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Describa el incidente"
                                value={descripcionReporte}
                                onChange={(e) => setDescripcionReporte(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Por favor, ingrese una descripciÃ³n para la solicitud.
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group controlId="formFile" className="mb-3">
                            <Form.Label>Subir Imagen (opcional)</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={onImageChangeReporte}
                            />
                            {imagenReporte && (
                                <div className="mt-2">
                                    <strong>Imagen seleccionada:</strong> {imagenReporte.name}
                                </div>
                            )}
                        </Form.Group>

                        <Button
                            variant="primary"
                            type="submit"
                            className="btn-tipo w-100"
                            disabled={loadingReporte}
                        >
                            {loadingReporte ? "Enviando..." : "Enviar Reporte"}
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className="btn-tipo" onClick={cerrarModalReporte}>
                        Cerrar
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );

};

export default Principal;