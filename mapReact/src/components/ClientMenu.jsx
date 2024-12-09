import { Container, Nav, Navbar, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const ClientMenu = () => {
    const navigate = useNavigate();

    const handleEntrarClick = () => {
        navigate('/login');
    };

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Link} to="/" className="title-2">🗺️ MapBolivia</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                    </Nav>
                    <Button className="btn-tipo" onClick={handleEntrarClick}>
                        Iniciar Sesión
                    </Button>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default ClientMenu;
