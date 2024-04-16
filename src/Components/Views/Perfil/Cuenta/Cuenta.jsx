import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getCookie, eraseCookie } from "../../../../utils/cookieUtils";
import "bootstrap/dist/css/bootstrap.min.css";
import AlertService from "../../../../Services/AlertService/AlertService";
import { API_URL } from "../../../../config";
import { useNavigate } from "react-router-dom";
import { Table, Container, Card, Button, Spinner, Modal, Form } from "react-bootstrap";

const Cuenta = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [editedUserData, setEditedUserData] = useState(null);
  const userId = getCookie("userId");
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/usuarios/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del usuario:", error);
      });
  }, []);

  const actualizarDatosUsuario = () => {
    axios
      .get(`${API_URL}/usuarios/${userId}`)
      .then((response) => {
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error al obtener los datos del usuario:", error);
      });
  };

  const handleEditUser = () => {
    if (editedUserData) {
      axios.patch(`${API_URL}/usuarios/${userId}`, editedUserData)
        .then((response) => {
          AlertService.success("Datos de usuario actualizados con éxito");
          console.log("Datos de usuario actualizados:", response.data);
          actualizarDatosUsuario();
          setShowModal(false);
        })
        .catch((error) => {
          console.error("Error al actualizar los datos del usuario:", error);
          AlertService.error("Error al actualizar los datos del usuario");
        });
    }
  };
  
  const handleDeleteAccount = () => {
    axios
      .delete(`${API_URL}/usuarios/${userId}`)
      .then((response) => {
        AlertService.success("Cuenta eliminada con éxito");
        eraseCookie("token");
        console.log("Cuenta eliminada con éxito:", response.data);
        navigate('/'); // Redirigir al usuario a la página de inicio
        window.location.reload(); // Recargar la página
      })
      .catch((error) => {
        AlertService.error("Error al eliminar la cuenta");
        console.error("Error al eliminar la cuenta:", error);
      });
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  return (
    <div className="courses-container mt-5">
      <Container style={{ marginBottom: '20px' }}>
        <Card className="courses-container bg-dark text-light courses-container">
          <h1 className="mb-0">Perfil</h1>
        </Card>
      </Container>
      <div className="card courses-container">
        <div className="card-body">
          {user && (
            <div className="row">
              <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
                {user.imagePerfil?.imageUrl ? (
                  <img
                    src={user.imagePerfil.imageUrl}
                    alt="Perfil de usuario"
                    className="rounded-circle mb-4 img-fluid"
                    style={{ marginBottom: '20px' }} // Agregamos margen inferior
                  />
                ) : (
                  <img
                    src="https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"
                    alt="Perfil de usuario"
                    className="rounded-circle mb-4 img-fluid"
                    style={{ marginBottom: '20px' }} // Agregamos margen inferior
                  />
                )}
                <Button variant="primary" onClick={() => setShowModal(true)}>Editar datos</Button> {/* Cambiamos a Button */}
                <Table bordered>
                  <tbody>
                    <tr>
                      <th>Nombre:</th> {/* Cambiamos a th */}
                      <td>{user.User}</td>
                    </tr>
                    <tr>
                      <th>Email:</th> {/* Cambiamos a th */}
                      <td>{user.Mail}</td>
                    </tr>
                    <tr>
                      <th>Rol:</th> {/* Cambiamos a th */}
                      <td>{user.Rol}</td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <div className="col-md-6 col-lg-8">
                <div className="container">
                  <div className="card">
                    <h1>Configuración</h1>
                    <Button variant="primary" onClick={() => setShowModal(true)}>Editar datos del usuario</Button> {/* Cambiamos a Button */}
                    <Button variant="danger" onClick={() => setShowDeleteConfirmation(true)}>Eliminar cuenta</Button> {/* Cambiamos a Button */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar datos de usuario</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Nombre de usuario</Form.Label>
              <Form.Control type="text" placeholder="Enter username" name="User" defaultValue={user?.User} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" placeholder="Enter email" name="Mail" defaultValue={user?.Mail} onChange={handleChange} />
            </Form.Group>
            <Form.Group controlId="formBasicRole">
              <Form.Label>Rol</Form.Label>
              <Form.Control type="text" placeholder="Enter role" name="Rol" defaultValue={user?.Rol} onChange={handleChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handleEditUser}>
            Guardar cambios
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal de confirmación de eliminación de cuenta */}
      <Modal show={showDeleteConfirmation} onHide={() => setShowDeleteConfirmation(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Eliminar cuenta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          ¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={handleDeleteAccount}>
            Eliminar cuenta
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Cuenta;
