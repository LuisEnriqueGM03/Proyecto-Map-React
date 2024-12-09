import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Container, Row, Button , Form} from "react-bootstrap";
import NavMenu from "../../../components/NavMenu.jsx";
import { GoogleMap, MarkerF, PolylineF } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import useGoogleMapLoader from "../../utils/useGoogleMapLoader.js";
import { obtenerUsuarioIdDesdeToken } from '../../utils/tokenUtils';

const containerStyle = {
    width: "100%",
    height: "250px",
};

const CarreteraList = () => {
    const [carreteras, setCarreteras] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [filtroTipoMunicipio, setFiltroTipoMunicipio] = useState("ninguno");
    const [municipiosFiltrados, setMunicipiosFiltrados] = useState([]);
    const [municipioSeleccionado, setMunicipioSeleccionado] = useState("ninguno");

    const { isLoaded, loadError } = useGoogleMapLoader();

    useEffect(() => {
        fetchMunicipios();
        getListaCarreteras();
        document.title = "Lista de Carreteras";
    }, []);

    const fetchMunicipios = async () => {
        try {
            const res = await axios.get("http://localhost:3000/municipios");
            setMunicipios(res.data);
        } catch (error) {
            console.error("Error al obtener los municipios:", error);
        }
    };

    const getListaCarreteras = async () => {
        try {
            const res = await axios.get("http://localhost:3000/carreteras");
            const carreterasConPuntos = await Promise.all(
                res.data.map(async (carretera) => {
                    const puntos = await getListaPuntos(carretera.id);
                    return { ...carretera, puntos };
                })
            );
            setCarreteras(carreterasConPuntos);
        } catch (error) {
            console.error("Error al obtener las carreteras:", error);
        }
    };

    const getListaPuntos = async (carreteraId) => {
        try {
            const res = await axios.get(`http://localhost:3000/puntos/${carreteraId}`);
            return res.data.polyline;
        } catch (error) {
            console.error(`Error al obtener los puntos de la carretera con ID ${carreteraId}:`, error);
            return [];
        }
    };

    const getMunicipioCoordinates = (municipioId) => {
        const municipio = municipios.find((m) => m.id === municipioId);
        return municipio ? { lat: municipio.lat, lng: municipio.long } : null;
    };

    const getMunicipioNombre = (municipioId) => {
        const municipio = municipios.find((m) => m.id === municipioId);
        return municipio ? municipio.nombre : "Desconocido";
    };

    const manejarFiltroTipoMunicipio = (tipo) => {
        setFiltroTipoMunicipio(tipo);
        setMunicipioSeleccionado("ninguno");

        if (tipo === "ninguno") {
            setMunicipiosFiltrados([]);
            getListaCarreteras(); 
        } else if (tipo === "origen") {
            const municipiosOrigen = carreteras.map(carretera => carretera.municipioOrigen);
            const municipiosUnicos = municipios.filter(municipio => municipiosOrigen.includes(municipio.id));
            setMunicipiosFiltrados(municipiosUnicos);
        } else if (tipo === "destino") {
            const municipiosDestino = carreteras.map(carretera => carretera.municipioDestino);
            const municipiosUnicos = municipios.filter(municipio => municipiosDestino.includes(municipio.id));
            setMunicipiosFiltrados(municipiosUnicos);
        }
    };

    const manejarSeleccionMunicipio = (idMunicipio) => {
        setMunicipioSeleccionado(idMunicipio);
        if (idMunicipio === "ninguno") {
            getListaCarreteras(); 
        } else {
            filtrarCarreteras(filtroTipoMunicipio, idMunicipio);
        }
    };

    const filtrarCarreteras = async (tipo, idMunicipio) => {
        try {
            if (!tipo || idMunicipio === "ninguno") {
                getListaCarreteras(); 
                return;
            }

            let carreterasFiltradas;
            if (tipo === "origen") {
                carreterasFiltradas = carreteras.filter(carretera => carretera.municipioOrigen === parseInt(idMunicipio));
            } else if (tipo === "destino") {
                carreterasFiltradas = carreteras.filter(carretera => carretera.municipioDestino === parseInt(idMunicipio));
            }

            setCarreteras(carreterasFiltradas);
        } catch (error) {
            console.error("Error al filtrar carreteras:", error);
        }
    };

    if (loadError) {
        return <div>Error al cargar Google Maps.</div>;
    }

    const eliminarCarretera = (id) => {
        const confirm = window.confirm("¿Está seguro de que desea eliminar esta carretera?");
        if (!confirm) return;
    
        axios
            .delete(`http://localhost:3000/carreteras/${id}`)
            .then(() => {
                const usuarioId = obtenerUsuarioIdDesdeToken();
                axios.post("http://localhost:3000/historial", {
                    usuarioId: usuarioId,
                    accion: "Eliminar",
                    entidad: "Carretera",
                    entidadId: id
                })
                .then(() => {
                    console.log("Acción registrada en el historial.");
                })
                .catch((error) => {
                    console.error("Error al registrar la acción en el historial:", error);
                });
                getListaCarreteras();
            })
            .catch((error) => {
                console.error("Error al eliminar la carretera:", error);
            });
    };
    

    return (
        <>
        <NavMenu />
        <Container className="mt-4">
            <Card className="p-4 fold-big">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="mb-0">Lista de Carreteras</h2>
                        <Button as={Link} to="/carretera/crear" className="btn-user">
                            <i className="fas fa-plus me-2"></i> Agregar Carretera
                        </Button>
                    </div>
    
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Group controlId="filtroTipoMunicipio">
                                <Form.Label><strong>Filtrar por</strong></Form.Label>
                                <Form.Select 
                                    value={filtroTipoMunicipio} 
                                    onChange={(e) => manejarFiltroTipoMunicipio(e.target.value)}
                                >
                                    <option value="ninguno">Ninguno</option>
                                    <option value="origen">Municipio de Origen</option>
                                    <option value="destino">Municipio de Destino</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
    
                        <Col md={6}>
                            <Form.Group controlId="municipioSeleccionado">
                                <Form.Label><strong>Seleccione Municipio</strong></Form.Label>
                                <Form.Select 
                                    value={municipioSeleccionado} 
                                    onChange={(e) => manejarSeleccionMunicipio(e.target.value)}
                                    disabled={filtroTipoMunicipio === "ninguno"}
                                >
                                    <option value="ninguno">Ninguno</option>
                                    {municipiosFiltrados.map((municipio) => (
                                        <option key={municipio.id} value={municipio.id}>
                                            {municipio.nombre}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
    
                    <Row>
                        {carreteras.map((carretera) => {
                            const municipioOrigenCoords = getMunicipioCoordinates(carretera.municipioOrigen);
                            const municipioDestinoCoords = getMunicipioCoordinates(carretera.municipioDestino);
                            const municipioOrigenNombre = getMunicipioNombre(carretera.municipioOrigen);
                            const municipioDestinoNombre = getMunicipioNombre(carretera.municipioDestino);
    
                            return (
                                <Col xs={12} sm={6} md={6} lg={6} key={carretera.id} className="mb-4">
                                    <Card className="fold-big-login">
                                        <Card.Body>
                                            <h5 className="mb-3 text-center">{carretera.nombre}</h5>
    
                                            <div className="mb-2">
                                                <strong>Municipio Origen: </strong>
                                                {municipioOrigenNombre}
                                            </div>
    
                                            <div className="mb-2">
                                                <strong>Municipio Destino: </strong>
                                                {municipioDestinoNombre}
                                            </div>
    
                                            <div className="mb-2">
                                                <strong>Descripción: </strong>
                                                {carretera.descripcion || "Sin descripción"}
                                            </div>
    
                                            <div className="mb-3">
                                                <strong>Estado: </strong>
                                                <span
                                                    style={{
                                                        color: carretera.estado === "Libre" ? "#004d00" : "#FF0000",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {carretera.estado}
                                                </span>
                                            </div>
    
                                            <div style={{ width: "100%", height: "250px" }}>
                                                {isLoaded ? (
                                                    <GoogleMap
                                                        mapContainerStyle={containerStyle}
                                                        center={
                                                            municipioOrigenCoords
                                                                ? municipioOrigenCoords
                                                                : { lat: -17.78302580071355, lng: -63.180359841218795 }
                                                        }
                                                        zoom={12}
                                                    >
                                                        {carretera.puntos && carretera.puntos.length > 0 && (
                                                            <PolylineF
                                                                path={carretera.puntos}
                                                                options={{
                                                                    strokeColor: carretera.estado === "Libre" ? "#004d00" : "#FF0000",
                                                                    strokeOpacity: 0.8,
                                                                    strokeWeight: 4,
                                                                    clickable: false,
                                                                    draggable: false,
                                                                    editable: false,
                                                                    geodesic: false,
                                                                }}
                                                            />
                                                        )}
                                                        {municipioOrigenCoords && (
                                                            <MarkerF
                                                                position={municipioOrigenCoords}
                                                                title={`Municipio Origen: ${municipioOrigenNombre}`}
                                                                icon={{
                                                                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                                                }}
                                                            />
                                                        )}
                                                        {municipioDestinoCoords && (
                                                            <MarkerF
                                                                position={municipioDestinoCoords}
                                                                title={`Municipio Destino: ${municipioDestinoNombre}`}
                                                                icon={{
                                                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                                                }}
                                                            />
                                                        )}
                                                    </GoogleMap>
                                                ) : (
                                                    <p>Cargando mapa...</p>
                                                )}
                                            </div>
    
                                            <div className="d-flex justify-content-around mt-3 w-100">
                                                <Button
                                                    as={Link}
                                                    to={`/carretera/${carretera.id}/editar`}
                                                    className="btn-user"
                                                >
                                                    <i className="fas fa-edit me-2"></i> Editar
                                                </Button>
    
                                                <Button
                                                    onClick={() => eliminarCarretera(carretera.id)}
                                                    className="btn-user"
                                                >
                                                    <i className="fas fa-trash-alt me-2"></i> Eliminar
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            );
                        })}
                    </Row>
                </Card.Body>
            </Card>
        </Container>
    </>    
    );
    
};

export default CarreteraList;
