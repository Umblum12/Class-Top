import React, { useState, useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';

const ModalImages = ({ show, handleClose, saveImages   }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const fileInputRef = useRef(null);

    const handleImageUpload = () => {
        try {
            if (!selectedFiles || selectedFiles.length === 0) {

                return;
            }

            saveImages(selectedFiles); // Llama a la función de cierre y pasa las imágenes seleccionadas
            handleClose();
        } catch (error) {
            console.error("Error al subir las imágenes:", error);
            // Agregar lógica adicional para manejar errores
        }
    };
    


    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        setSelectedFiles(files);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleClickFileInput = () => {
        fileInputRef.current.click();
    };

    const handleRemoveFile = () => {
        setSelectedFiles([]);
    };

    return (
        <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
            <Modal.Header closeButton>
                <Modal.Title>Subir imágenes</Modal.Title>
            </Modal.Header>
            <Modal.Body onDrop={handleDrop} onDragOver={handleDragOver}>
                {selectedFiles.length > 0 ? (
                    <div>
                        <p>Archivos seleccionados:</p>
                        <ul>
                            {selectedFiles.map((file, index) => (
                                <li key={index}>
                                    <strong>Nombre:</strong> {file.name} <br />
                                    <strong>Tipo:</strong> {file.type} <br />
                                    <strong>Tamaño:</strong> {(file.size / 1024).toFixed(2)} KB <br />
                                    <img src={URL.createObjectURL(file)} alt={file.name} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                                </li>
                            ))}
                        </ul>
                        <Button variant="danger" onClick={handleRemoveFile}>
                            Eliminar archivos seleccionados
                        </Button>
                    </div>
                ) : (
                    <div
                        onClick={handleClickFileInput}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', cursor: 'pointer' }}
                    >
                        <p>Arrastra y suelta aquí tus imágenes</p>
                        <p>O haz clic para seleccionarlas</p>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            onChange={(e) => setSelectedFiles(Array.from(e.target.files))}
                            multiple
                        />
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
                {selectedFiles && selectedFiles.length > 0 && (
                    <Button variant="success" onClick={handleImageUpload}>
                        Guardar
                    </Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default ModalImages;
