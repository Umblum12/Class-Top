import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSync, faTimes } from '@fortawesome/free-solid-svg-icons';
import { getCookie } from '../../../../../utils/cookieUtils';
import ModalImages from "./ModalImages";
import { API_URL } from '../../../../../config';

const ModalEditarClase = ({ show, handleClose, registroSeleccionado, setRegistros }) => {
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [savedImages, setsavedImages] = useState([]);
  const [formularioActualizar, setFormularioActualizar] = useState({
    title: '',
    description: '',
    imageSrc: '',
    category: '',
    guestCount: '',
    location: '',
    price: '',
    userId: getCookie('userId'),
  });

  const saveImages = (images) => {
    setsavedImages(images);
  };

  useEffect(() => {
    if (registroSeleccionado) {
      setFormularioActualizar({
        title: registroSeleccionado.title || '',
        description: registroSeleccionado.description || '',
        imageSrc: registroSeleccionado.imageSrc || '',
        category: registroSeleccionado.category?.join(', ') || '',
        guestCount: registroSeleccionado.guestCount || '',
        location: registroSeleccionado.location || '',
        price: registroSeleccionado.price || '',
        userId: getCookie('userId'),
      });
    }
  }, [registroSeleccionado]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormularioActualizar({
      ...formularioActualizar,
      [name]: value
    });
  };

  const handleEditar = async () => {
    const id = registroSeleccionado?._id;
    try {
      await axios.patch(`${API_URL}/clases/${id}`, formularioActualizar);
      const userId = getCookie('userId');
      console.log(userId);
      const response = await axios.get(`${API_URL}/clases?userId=${userId}`);
      console.log(response.data);
      setRegistros(response.data);
      handleClose();
    } catch (error) {
      console.error('Error al actualizar el registro:', error);
    }
  };

  const handleOpenImagesModal = () => {
    setShowImagesModal(true);
  };

  const handleCloseImagesModal = () => {
    setShowImagesModal(false);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Clase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form className="mx-auto max-w-md">
            <div className="mb-4">
              <label htmlFor="title" className="form-label">Título:</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formularioActualizar.title}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="description" className="form-label">Descripción:</label>
              <input
                type="text"
                id="description"
                name="description"
                value={formularioActualizar.description}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Imágenes:</Form.Label>
              <br />
              {registroSeleccionado && registroSeleccionado.imageSrc && registroSeleccionado.imageSrc.length > 0 ? (
                <div>
                  <p>Imágenes cargadas:</p>
                  <ul>
                    {registroSeleccionado.imageSrc.map((image, index) => (
                      <li key={index}>
                        <img src={image.imageUrl} alt={image.public_id} style={{ width: '100px', height: '100px' }} />
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Button onClick={handleOpenImagesModal}>Subir Imágenes</Button>
              )}
            </Form.Group>
            <div className="mb-4">
              <label htmlFor="category" className="form-label">Categoría (separadas por coma):</label>
              <input
                type="text"
                id="category"
                name="category"
                value={formularioActualizar.category}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="guestCount" className="form-label">Número de Invitados:</label>
              <input
                type="text"
                id="guestCount"
                name="guestCount"
                value={formularioActualizar.guestCount}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="location" className="form-label">Ubicación:</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formularioActualizar.location}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="price" className="form-label">Precio:</label>
              <input
                type="text"
                id="price"
                name="price"
                value={formularioActualizar.price}
                onChange={handleInputChange}
                className="form-control"
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleClose}>
            <FontAwesomeIcon icon={faTimes} /> Cancelar
          </Button>
          <Button variant="primary" onClick={handleEditar}>
            <FontAwesomeIcon icon={faSync} /> Actualizar
          </Button>
        </Modal.Footer>
      </Modal>

      {showImagesModal && (
        <ModalImages
          show={showImagesModal}
          handleClose={handleCloseImagesModal}
          saveImages={saveImages}
        />
      )}
    </>
  );
};

export default ModalEditarClase;
