import { useState, useEffect } from "react";
import { Button, Card, Container, Form, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { GoogleMap, Marker } from "@react-google-maps/api";
import axios from "axios";
import useGoogleMapLoader from "../../utils/useGoogleMapLoader"; 
import NavMenu from "../../../components/NavMenu";
import { obtenerUsuarioIdDesdeToken } from "../../utils/tokenUtils";

const containerStyle = {
    width: "100%",
    height: "500px",
};

const center = {
    lat: -17.005378461046188,
    lng: -64.79982534133515,
};

const FormMunicipio = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const [lat, setLat] = useState(null);
    const [long, setLong] = useState(null);
    const [validated, setValidated] = useState(false);
    const { isLoaded } = useGoogleMapLoader();

    useEffect(() => {
        if (id) {
            axios
                .get(`http://localhost:3000/municipios/${id}`)
                .then((res) => {
                    const municipio = res.data;
                    setNombre(municipio.nombre);
                    setLat(municipio.lat);
                    setLong(municipio.long);
                })
                .catch((error) => {
                    console.error("Error al cargar el municipio:", error);
                });
        }
    }, [id]);

    const onMapClick = (event) => {
        setLat(event.latLng.lat());
        setLong(event.latLng.lng());
    };

    const onGuardarClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const municipio = {
            nombre,
            lat,
            long,
        };

        if (id) {
            axios
                .put(`http://localhost:3000/municipios/${id}`, municipio)
                .then(() => {
                    const token = localStorage.getItem('token');
                    const usuarioId = obtenerUsuarioIdDesdeToken(token); 
                    const historial = {
                        usuarioId,
                        accion: "Editar",
                        entidad: "Municipio",
                        entidadId: id
                    };
        
                    axios.post("http://localhost:3000/historial", historial)
                        .then(() => {
                            console.log("Historial de edición registrado.");
                        })
                        .catch((error) => {
                            console.error("Error al registrar el historial de edición:", error);
                        });
        
                    navigate("/municipios");
                })
                .catch((error) => {
                    console.error("Error al actualizar el municipio:", error);
                });
        } else {
            axios
                .post("http://localhost:3000/municipios", municipio)
                .then((res) => {
                    const token = localStorage.getItem('token');
                    const usuarioId = obtenerUsuarioIdDesdeToken(token); 
                    const municipioCreadoId = res.data.id;
                    const historial = {
                        usuarioId,
                        accion: "Crear",
                        entidad: "Municipio",
                        entidadId: municipioCreadoId
                    };
        
                    axios.post("http://localhost:3000/historial", historial)
                        .then(() => {
                            console.log("Historial de creación registrado.");
                        })
                        .catch((error) => {
                            console.error("Error al registrar el historial de creación:", error);
                        });
        
                    navigate("/municipios");
                })
                .catch((error) => {
                    console.error("Error al crear el municipio:", error);
                });
        }
        };

    return (
        <>
        <NavMenu />
            <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "120vh" }}>
                <Card className="p-4 fold-big-login" style={{ width: "800px" }}>
                    <Card.Body>
                        <h2 className="mb-4 text-center">{id ? "Editar Municipio" : "Crear Municipio"}</h2>
                        <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                            <Form.Group controlId="formNombre" className="mb-3">
                                <Form.Label>Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingrese el nombre del municipio"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor, ingrese el nombre del municipio.
                                </Form.Control.Feedback>
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
                                    <Form.Group controlId="formLng">
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
                                        mapContainerStyle={containerStyle}
                                        center={lat && long ? { lat, lng: long } : center}
                                        zoom={lat && long ? 15 : 6}
                                        onClick={onMapClick}
                                    >
                                        {lat && long && (
                                            <Marker position={{ lat, lng: long }} title="Ubicación seleccionada" />
                                        )}
                                    </GoogleMap>
                                ) : (
                                    <p>Cargando mapa...</p>
                                )}
                            </div>

                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit" className="btn-tipo">
                                    {id ? "Guardar Cambios" : "Guardar Municipio"}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default FormMunicipio;
