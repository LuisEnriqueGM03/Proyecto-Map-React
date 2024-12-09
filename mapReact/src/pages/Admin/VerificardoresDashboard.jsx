import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './style.css';
import NavMenu from '../../components/NavMenu.jsx';

const DashboardVerificador = () => {
    return (
        <>
            <NavMenu />
            <Container className="d-flex flex-column justify-content-center align-items-center" style={{ height: '80vh' }}>
                <h1 className="mb-5 text-center">Dashboard Verificador</h1>

                <Row className="justify-content-center" style={{ width: '100%' }}>
                    <Col md={6} lg={4} className="mb-4">
                        <Link to="/Municipios" className="text-decoration-none">
                            <Card className="text-center fold" style={{ height: '300px', cursor: 'pointer' }}>
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <Card.Title className={"title"}>Gestión de Municipios</Card.Title>
                                    <i className="fas fa-city fa-8x mb-5"></i>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>

                    <Col md={6} lg={4} className="mb-4">
                        <Link to="/Carretera" className="text-decoration-none">
                            <Card className="text-center fold" style={{ height: '300px', cursor: 'pointer' }}>
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <Card.Title className={"title"}>Gestión de Carreteras</Card.Title>
                                    <i className="fas fa-road fa-8x mb-5"></i>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>

                    <Col md={6} lg={4} className="mb-4">
                        <Link to="/Incidentes" className="text-decoration-none">
                            <Card className="text-center fold" style={{ height: '300px', cursor: 'pointer' }}>
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <Card.Title className={"title"}>Gestión de Incidentes</Card.Title>
                                    <i className="fas fa-exclamation-triangle fa-8x mb-5"></i>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>

                    <Col md={6} lg={4} className="mb-4">
                        <Link to="/solicitudes" className="text-decoration-none">
                            <Card className="text-center fold" style={{ height: '300px', cursor: 'pointer' }}>
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <Card.Title className={"title"}>Solicitudes de Incidentes</Card.Title>
                                    <i className="fas fa-envelope-open-text fa-8x mb-5"></i>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>

                    <Col md={6} lg={4} className="mb-4">
                        <Link to="/principal" className="text-decoration-none">
                            <Card className="text-center fold" style={{ height: '300px', cursor: 'pointer' }}>
                                <Card.Body className="d-flex flex-column justify-content-between">
                                    <Card.Title className={"title"}>Vista de Mapa</Card.Title>
                                    <i className="fas fa-map fa-8x mb-5"></i>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>

                </Row>
            </Container>
        </>
    );
};

export default DashboardVerificador;
