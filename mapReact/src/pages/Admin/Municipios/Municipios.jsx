import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Container, Row, Button } from "react-bootstrap";
import NavMenu from "../../../components/NavMenu.jsx";
import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { Link } from "react-router-dom";
import useGoogleMapLoader from "../../utils/useGoogleMapLoader.js"; 
import { obtenerUsuarioIdDesdeToken } from '../../utils/tokenUtils';

const containerStyle = {
    width: "100%",
    height: "150px",
};

const ListaMunicipios = () => {
    const [municipios, setMunicipios] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false); 
    const { isLoaded: googleMapsLoaded } = useGoogleMapLoader();

    useEffect(() => {
        getListaMunicipios();
        document.title = "Lista de Municipios";
    }, []);

    useEffect(() => {
        if (googleMapsLoaded) {
            setIsLoaded(true);
        }
    }, [googleMapsLoaded]);

    const getListaMunicipios = () => {
        axios
            .get("http://localhost:3000/municipios")
            .then((res) => {
                setMunicipios(res.data);
            })
            .catch((error) => {
                console.error("Error al obtener los municipios:", error);
            });
    };

const eliminarMunicipio = (id) => {
    const confirm = window.confirm("¿Está seguro de que desea eliminar este municipio?");
    if (!confirm) return;

    axios
        .delete(`http://localhost:3000/municipios/${id}`)
        .then(() => {
            const usuarioId = obtenerUsuarioIdDesdeToken();
            axios.post("http://localhost:3000/historial", {
                usuarioId: usuarioId,
                accion: "Eliminar",
                entidad: "Municipio",
                entidadId: id
            })
            .then(() => {
                console.log("Acción registrada en el historial.");
            })
            .catch((error) => {
                console.error("Error al registrar la acción en el historial:", error);
            });


            getListaMunicipios();
        })
        .catch((error) => {
            console.error("Error al eliminar el municipio:", error);
        });
};


    return (
        <>
            <NavMenu />
            <Container className="mt-4">
                <Card className="p-4 fold-big">
                    <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2 className="mb-0">Lista de Municipios</h2>
                            <Button as={Link} to="/municipios/crear" className="btn-user">
                                <i className="fas fa-plus me-2"></i> Agregar Municipio
                            </Button>
                        </div>

                        <Row>
                            {municipios.map((municipio) => (
                                <Col xs={12} sm={6} md={4} lg={3} key={municipio.id} className="mb-4">
                                    <Card className="fold-tipo">
                                        <Card.Body className="d-flex flex-column align-items-center">
                                            <Card.Title className="nombre mb-3 text-center">
                                                {municipio.nombre}
                                            </Card.Title>

                                            {/* Mapa con marcador */}
                                            <div style={{ width: "100%", height: "150px" }}>
                                                {isLoaded ? (
                                                    <GoogleMap
                                                        mapContainerStyle={containerStyle}
                                                        center={{ lat: municipio.lat, lng: municipio.long }}
                                                        zoom={14}
                                                        options={{
                                                            gestureHandling: "greedy",
                                                            scrollwheel: true,
                                                            zoomControl: true,
                                                            disableDefaultUI: false,
                                                        }}
                                                    >
                                                        <MarkerF position={{ lat: municipio.lat, lng: municipio.long }} title="Ubicación seleccionada" />
                                                    </GoogleMap>
                                                ) : (
                                                    <p>Cargando mapa...</p>
                                                )}
                                            </div>

                                            <div className="d-flex justify-content-around mt-3 w-100">
                                                <Button
                                                    as={Link}
                                                    to={`/municipios/${municipio.id}/editar`}
                                                    className="btn-user"
                                                >
                                                    <i className="fas fa-edit me-2"></i> Editar
                                                </Button>

                                                <Button
                                                    onClick={() => eliminarMunicipio(municipio.id)}
                                                    className="btn-user"
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

export default ListaMunicipios;
