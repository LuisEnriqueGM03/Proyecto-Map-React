import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import NavMenu from "../../../components/NavMenu.jsx";

const FormTipoIncidente = () => {
    const navigate = useNavigate();
    const { id } = useParams(); 
    const [nombre, setNombre] = useState('');
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!id) return; 
        getTipoIncidenteById();
    }, [id]);

    const getTipoIncidenteById = () => {
        axios.get(`http://localhost:3000/tipos_incidente/${id}`)
            .then(res => {
                const tipoIncidente = res.data;
                setNombre(tipoIncidente.nombre);
            })
            .catch(error => {
                console.error("Error al obtener el tipo de incidente:", error);
                setError("No se pudo cargar el tipo de incidente.");
            });
    };

    const onGuardarClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.currentTarget;
        setValidated(true);

        if (form.checkValidity() === false) {
            return;
        }

        const tipoIncidente = { nombre };

        if (id) {
            editTipoIncidente(tipoIncidente);
        } else {
            insertTipoIncidente(tipoIncidente);
        }
    };

    const editTipoIncidente = (tipoIncidente) => {
        axios.put(`http://localhost:3000/tipos_incidente/${id}`, tipoIncidente)
            .then(res => {
                console.log("Tipo de incidente actualizado:", res.data);
                navigate('/tiposincidentes');
            })
            .catch(error => {
                console.error("Error al actualizar el tipo de incidente:", error);
                setError("Error al actualizar el tipo de incidente.");
            });
    };

    const insertTipoIncidente = (tipoIncidente) => {
        axios.post('http://localhost:3000/tipos_incidente', tipoIncidente)
            .then(res => {
                console.log("Tipo de incidente creado:", res.data);
                navigate('/tiposincidentes');
            })
            .catch(error => {
                console.error("Error al crear el tipo de incidente:", error);
                setError("Error al crear el tipo de incidente.");
            });
    };

    return (
        <>
            <NavMenu />
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ height: '100vh' }}
            >
                <Card className="p-4 fold-big-login" style={{ width: '500px' }}>
                    <Card.Body>
                        <h2 className="mb-4 text-center">
                            {id ? "Editar Tipo de Incidente" : "Crear Tipo de Incidente"}
                        </h2>
                        {error && <p className="text-danger text-center">{error}</p>}
                        <Form noValidate validated={validated} onSubmit={onGuardarClick}>
                            <Form.Group controlId="formNombre" className="mb-3">
                                <Form.Label className="title-2">Nombre</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Ingresa el nombre del tipo de incidente"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Por favor ingrese un nombre.
                                </Form.Control.Feedback>
                            </Form.Group>

                            <div className="d-flex justify-content-center">
                                <Button variant="primary" type="submit" className="btn-tipo">
                                    {id ? "Guardar Cambios" : "Guardar Tipo"}
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
};

export default FormTipoIncidente;
