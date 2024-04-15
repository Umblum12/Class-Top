import React, { useState } from "react";
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import ModalImages from "./ModalImages";
import { getCookie } from "../../../../../utils/cookieUtils";
import axios from 'axios'; // Importa Axios
import AlertService from "../../../../../Services/AlertService/AlertService";
import { API_URL } from "../../../../../config";

const ModalCrearClase = ({ show, handleClose }) => {
    const [showImagesModal, setShowImagesModal] = useState(false);
    const [IsLoading, setIsLoading] = useState(false);
    const [savedImages, setsavedImages] = useState([]);
    const userId = getCookie('userId');
    const [formularioCrear, setFormularioCrear] = useState({
        title: "",
        description: "",
        DateStart: "",
        DateEnd: "",
        category: "",
        guestCount: "",
        location: "",
        price: "",
        userId: userId
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
            // Itera sobre cada imagen y agrégala al FormData
            savedImages.forEach((image, index) => {
                formData.append(`files`, image); // Asegúrate de dar un nombre único a cada archivo
            });

            // Realiza la petición para subir las imágenes al servidor
            const response = await axios.post(`${API_URL}/clases/UpImg/${id}`, formData);

            console.log('Respuesta del servidor:', response.data);
            handleClose();
        } catch (error) {
            console.error('Error al subir las imágenes:', error);
            // Puedes agregar lógica adicional para manejar errores aquí
        }
    };





    const handleCrear = async () => {
        try {
            setIsLoading(true);
            const response = await axios.post(`${API_URL}/clases`, formularioCrear);
            console.log('Respuesta del servidor:', response.data);
            const claseId = response.data._id; // Obtiene el ID de la clase creada
            const titulo = response.data.title; // Obtiene el titulo de la clase creada
            console.log('ID de la clase creada:', claseId);
            handleSaveImages(claseId);
            // Crear un nuevo chat de grupo asociado a la clase recién creada
            const nuevoChat = await axios.post('https://clon-airbnb-api-programmingsoft.koyeb.app/chat/grupo', {
                claseId: claseId,
                nombre: nombreClase, // Utiliza el nombre de la clase como nombre del chat
            });

            console.log('Chat de grupo creado:', nuevoChat.data);
            AlertService.success("¡Clase creada exitosamente!");
            handleClose();
            setIsLoading(false);

        } catch (error) {
            setIsLoading(false);
            console.error("Error al crear la clase:", error);
            // Puedes agregar lógica adicional para manejar errores
        }
    };


    const handleModalClose = () => {
        // Limpiar campos y reiniciar validaciones
        handleClose();
    };

    const handleOpenImagesModal = () => {
        // Esta función abrirá el modal de ModalImages
        setShowImagesModal(true);
    };

    const handleCloseImagesModal = () => {
        // Esta función cerrará el modal de ModalImages
        setShowImagesModal(false);
    };

    // Definir la función saveImages en ModalCrearClase
    const saveImages = (images) => {
        setsavedImages(images);
    };

    const handleRemoveFile = (index) => {
        // Eliminar el archivo de la lista de imágenes
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
                        <h2>Crear Nueva Clase</h2>
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
                            <Form.Label>Fecha de inicio:</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Ingrese fecha"
                                name="DateStart"
                                value={formularioCrear.DateStart}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="date">
                            <Form.Label>Fecha de finalización:</Form.Label>
                            <Form.Control
                                type="date"
                                placeholder="Ingrese fecha"
                                name="DateEnd"
                                value={formularioCrear.DateEnd}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        {/* Resto del formulario */}
                        <Form.Group className="mb-3" controlId="image">
                            <Form.Label>Imagenes:</Form.Label>
                            <br></br>
                            {/* Mostrar imágenes cargadas o botón para cargar imágenes */}
                            {savedImages.length > 0 ? (
                                <div>
                                    <p>Archivos seleccionados:</p>
                                    <ul>
                                        {savedImages.map((file, index) => (
                                            <li key={index}>
                                                {file.name} {/* Mostrar solo el nombre del archivo */}
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
                        <Form.Group className="mb-3" controlId="category">
                            <Form.Label>Categoría:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese la categoría"
                                name="category"
                                value={formularioCrear.category}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="guestCount">
                            <Form.Label>Cantidad de Invitados:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Ingrese la cantidad de invitados"
                                name="guestCount"
                                value={formularioCrear.guestCount}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="location">
                            <Form.Label>Ubicación:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese la ubicación"
                                name="location"
                                value={formularioCrear.location}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="price">
                            <Form.Label>Precio:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Ingrese el precio"
                                name="price"
                                value={formularioCrear.price}
                                onChange={handleInputChange}
                            />
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
                {IsLoading && (
                    <div className="overlay">
                        <Spinner className="custom-spinner" animation="border" />
                    </div>
                )}
            </Modal>
            {/* Renderizar el modal de imágenes solo si showImagesModal es true */}
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

export default ModalCrearClase;