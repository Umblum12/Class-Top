import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { getCookie, eraseCookie } from "../../../../utils/cookieUtils";
import { Button, Modal } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import AlertService from "../../../../Services/AlertService/AlertService";
import { API_URL } from "../../../../config";
import {  useNavigate } from "react-router-dom";

const Cuenta = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append("file", file);

    axios
      .post(`${API_URL}/usuarios/upload/${userId}`, formData)
      .then((response) => {
        AlertService.success("Imagen cargada con éxito");
        console.log("Imagen cargada con éxito:", response.data);
        actualizarDatosUsuario();
        setShowModal(false);
        setSelectedFile(null);
      })
      .catch((error) => {
        console.error("Error al cargar la imagen:", error);
      });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      console.log("Por favor, sube solo archivos de imagen.");
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setSelectedFile(file);
    } else {
      console.log("Por favor, sube solo archivos de imagen.");
    }
  };

  const handleClickFileInput = () => {
    fileInputRef.current.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleDeleteAccount = () => {
    axios
      .delete(`https://clon-airbnb-api-programmingsoft.koyeb.app/usuarios/${userId}`)
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

  return (
    <div className="container mt-5" style={{ paddingTop: "100px" }}>
      <div className="card">
        <div className="card-header bg-dark text-light">
          <h1 className="mb-0">Cuenta</h1>
        </div>
        <div className="card-body">
          {user && (
            <div className="row">
              <div className="col-md-6 col-lg-4 mb-4 mb-lg-0">
                {user.imagePerfil?.imageUrl ? (
                  <img
                    src={user.imagePerfil.imageUrl}
                    alt="Perfil de usuario"
                    className="rounded-circle mb-4 img-fluid"
                  />
                ) : (
                  <img
                    src="https://www.pngitem.com/pimgs/m/30-307416_profile-icon-png-image-free-download-searchpng-employee.png"
                    alt="Perfil de usuario"
                    className="rounded-circle mb-4 img-fluid"
                  />
                )}
                <Button onClick={() => setShowModal(true)}>Subir imagen</Button>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileInputChange}
                />
                {selectedFile && (
                  <div>
                    <p>Nombre del archivo: {selectedFile.name}</p>
                    <p>Tipo de archivo: {selectedFile.type}</p>
                    <Button onClick={handleRemoveFile}>Eliminar</Button>
                  </div>
                )}
                <table className="table">
                  <tbody>
                    <tr>
                      <th scope="row">Nombre:</th>
                      <td>{user.User}</td>
                    </tr>
                    <tr>
                      <th scope="row">Email:</th>
                      <td>{user.Mail}</td>
                    </tr>
                    <tr>
                      <th scope="row">Tipo:</th>
                      <td>{user.Rol}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-md-6 col-lg-8">
                <div className="container">
                  <div className="card">
                    <h1>Configuración</h1>
                    <Button variant="primary">Editar datos del usuario</Button>
                    <Button variant="danger" onClick={() => setShowDeleteConfirmation(true)}>Eliminar cuenta</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Subir imagen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFile ? (
            <div>
              <p>Nombre del archivo: {selectedFile.name}</p>
              <p>Tipo de archivo: {selectedFile.type}</p>
              <Button onClick={handleRemoveFile}>Eliminar</Button>
            </div>
          ) : (
            <div
              onClick={handleClickFileInput}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              style={{
                border: "2px dashed #ccc",
                padding: "20px",
                textAlign: "center",
                cursor: "pointer",
              }}
            >
              <p>Arrastra y suelta aquí tu imagen</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cerrar
          </Button>
          {selectedFile && (
            <Button variant="primary" onClick={() => handleUpload(selectedFile)}>
              Subir
            </Button>
          )}
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
