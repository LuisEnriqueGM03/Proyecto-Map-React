import { useState } from "react";
import { Container, Nav, Navbar, NavDropdown, Button, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import jwt_decode from "jwt-decode"; 

const NavMenu = () => {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);

    const token = localStorage.getItem("token");
    let userType = "";
    let userName = "";

    if (token) {
        const decoded = jwt_decode(token);
        userType = decoded.tipo;
        userName = decoded.nombre;
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleDashboardClick = () => {
        if (userType === "Administrador") {
            navigate("/adminDashboard");
        } else if (userType === "Verificador") {
            navigate("/verificadorDashboard");
        }
    };

    return (
        <Navbar expand="lg" className="custom-navbar">
            <Container>
                <Navbar.Brand as={Button} onClick={handleDashboardClick} className="btn-tipo">
                    {userType === "Administrador" ? "🗺️ Dashboard Administrador" : "🗺️ Dashboard Verificador"}
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">

                        {userType === "Administrador" && (
                            <>
                                <NavDropdown title="Usuarios" id="usuarios-nav-dropdown">
                                    <NavDropdown.Item as={Link} to="/usuarioslista">Lista de Usuarios</NavDropdown.Item>
                                    <NavDropdown.Item as={Link} to="/usuarios/crear">Crear Usuario</NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}

                        <NavDropdown title="Municipios" id="municipios-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/municipios">Lista de Municipios</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/municipios/crear">Crear Municipio</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Carreteras" id="carreteras-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/carretera">Lista de Carreteras</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/carretera/crear">Crear Carretera</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Incidentes" id="incidentes-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/incidentes">Lista de Incidentes</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/incidentes/crear">Crear Incidente</NavDropdown.Item>
                        </NavDropdown>
                        <NavDropdown title="Solicitudes" id="tipos-incidentes-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/solicitudes">Solicitudes</NavDropdown.Item>
                        </NavDropdown>
                        {userType === "Administrador" && (
                        <NavDropdown title="Tipos de Incidentes" id="tipos-incidentes-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/tiposincidentes">Lista de Tipos</NavDropdown.Item>
                            {userType === "Administrador" && (
                                <NavDropdown.Item as={Link} to="/tiposincidentes/crear">Crear Tipo</NavDropdown.Item>
                            )}
                        </NavDropdown>
                        )}

                        {userType === "Administrador" && (
                            <NavDropdown title="Historial" id="historial-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/historial">Ver Historial</NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>

                    <Dropdown align="end" show={showDropdown} onToggle={(isOpen) => setShowDropdown(isOpen)}>
                        <Dropdown.Toggle as={Button} variant="outline-light" className="text-white">
                            {userName ? userName : 'Usuario'}
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={handleLogout}>Cerrar Sesión</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default NavMenu;
