import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import ModalImages from "../CrearClasses/Modales/ModalImages";
import { getCookie } from "../../../../utils/cookieUtils";
import axios from 'axios';
import AlertService from "../../../../Services/AlertService/AlertService";
import { API_URL } from "../../../../config";

const ModalCrearArticulo = ({ show, handleClose }) => {
    const [showImagesModal, setShowImagesModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [savedImages, setsavedImages] = useState([]);
    const userId = getCookie('userId');
    const [formularioCrear, setFormularioCrear] = useState({
        title: "",
        description: "",
        Date: "",
        imageSrc: [],
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormularioCrear({
            ...formularioCrear,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        setFormularioCrear({
            ...formularioCrear,
            image: e.target.files[0]
        });
    };

    const handleSaveImages = async (id) => {
        try {
            const formData = new FormData();
            savedImages.forEach((image, index) => {
                formData.append(`files`, image);
            });

            await axios.post(`${API_URL}/articulo/UpImg/${id}`, formData);

            handleClose();
        } catch (error) {
            console.error('Error al subir las imágenes:', error);
        }
    };

    const handleCrear = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${API_URL}/articulo`, formularioCrear);

            const articuloId = response.data._id;
            handleSaveImages(articuloId);

            AlertService.success("¡Artículo creado exitosamente!");
            setIsLoading(false);
            handleClose();
        } catch (error) {
            setIsLoading(false);
            console.error("Error al crear el artículo:", error);
        }
    };

    const handleModalClose = () => {
        handleClose();
    };

    const handleOpenImagesModal = () => {
        setShowImagesModal(true);
    };

    const handleCloseImagesModal = () => {
        setShowImagesModal(false);
    };

    const saveImages = (images) => {
        setsavedImages(images);
    };

    const handleRemoveFile = (index) => {
        const newImages = [...savedImages];
        newImages.splice(index, 1);
        localStorage.setItem('selectedImages', JSON.stringify(newImages));
        setFormularioCrear({
            ...formularioCrear,
            images: newImages
        });
    };

    return (
        <>
            <Modal show={show} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title className="text-center">
                        <h2>Crear Nuevo Artículo</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="title">
                            <Form.Label>Título:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el título"
                                name="title"
                                value={formularioCrear.title}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="description">
                            <Form.Label>Descripción:</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                placeholder="Ingrese la descripción"
                                name="description"
                                value={formularioCrear.description}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="date">
                            <Form.Label>Fecha:</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Ingrese fecha"
                                name="Date"
                                value={formularioCrear.Date}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Imágenes:</Form.Label>
                            <br />
                            {savedImages.length > 0 ? (
                                <div>
                                    <p>Archivos seleccionados:</p>
                                    <ul>
                                        {savedImages.map((file, index) => (
                                            <li key={index}>
                                                {file.name}
                                                <Button variant="danger" onClick={() => handleRemoveFile(index)}>
                                                    Eliminar
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ) : (
                                <Button onClick={handleOpenImagesModal}>Subir Imágenes</Button>
                            )}
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleModalClose}>
                        <FontAwesomeIcon icon={faTimes} /> Cancelar
                    </Button>
                    <Button variant="success" onClick={handleCrear}>
                        <FontAwesomeIcon icon={faPlus} /> Crear
                    </Button>
                </Modal.Footer>
                {isLoading && (
                    <div className="overlay">
                        <Spinner className="custom-spinner" animation="border" />
                    </div>
                )}
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

export default ModalCrearArticulo;
