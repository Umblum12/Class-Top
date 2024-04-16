import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Card, Spinner } from 'react-bootstrap';
import { toast } from "react-toastify";
import { API_URL } from '../../../../config';
import ModalCrearArticulo from './ModalArticulos';


const CrudArticulos = () => {
  const [articulos, setArticulos] = useState([]);
  const [articulosEditables, setArticulosEditables] = useState([]);
  const [changedArticulos, setChangedArticulos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [showModal, setShowModal] = useState(false); // Estado para mostrar/ocultar el modal de crear artículo


  const obtenerArticulos = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${API_URL}/articulo`);
      setArticulos(response.data);
      setArticulosEditables(response.data.map(articulo => ({ ...articulo })));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error al obtener artículos:', error);
    }
  };

  useEffect(() => {
    obtenerArticulos();
  }, []);

  const handleInputChange = (index, fieldName, value) => {
    const updatedArticulos = [...articulosEditables];
    updatedArticulos[index][fieldName] = value;
    setArticulosEditables(updatedArticulos);

    if (!changedArticulos.includes(index)) {
      setChangedArticulos([...changedArticulos, index]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      await Promise.all(
        changedArticulos.map(async (index) => {
          const articuloId = articulosEditables[index]._id;
          const articuloExistente = articulos.find(articulo => articulo._id === articuloId);

          if (!articuloExistente) {
            console.error('El artículo con ID', articuloId, 'no existe en la base de datos.');
            return;
          }

          await axios.patch(`${API_URL}/articulo/${articuloId}`, articulosEditables[index]);
        })
      );

      setChangedArticulos([]);
      obtenerArticulos();
      // Mostrar notificación de éxito al guardar cambios
      toast.success('Cambios guardados exitosamente', {
        position: 'top-right',
        autoClose: 3000, // Cerrar automáticamente después de 3 segundos
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      toast.error('Error al guardar los cambios');
    }
  };

  const handleDelete = async (articuloId) => {
    try {
      await axios.delete(`${API_URL}/articulo/${articuloId}`);
      obtenerArticulos();
    } catch (error) {
      console.error('Error al eliminar el artículo:', error);
    }
  };

  const indexOfLastRecord = currentPage * perPage;
  const indexOfFirstRecord = indexOfLastRecord - perPage;
  const currentArticulos = articulosEditables.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(articulosEditables.length / perPage);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };




  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', marginTop: '5px', padding: '20px' }}>
      <Card>
        <Card.Body>
        <Button
          className="btn"
          style={{
            backgroundColor: "green",
            color: "white",
            marginRight: "10px",
            marginBottom: "20px"
          }}
          onClick={() => setShowModal(true)} // Abrir el modal de crear al hacer clic
        >
            Crear Articulo</Button>
          <Card.Title className="text-center" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
            Artículos
          </Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Descripción</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentArticulos.map((articulo, index) => (
                <tr key={articulo._id}>
                  <td>{articulo._id}</td>
                  <td>
                    <Form.Control
                      type="text"
                      value={articulo.title}
                      onChange={(e) => handleInputChange(indexOfFirstRecord + index, 'title', e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="text"
                      value={articulo.description}
                      onChange={(e) => handleInputChange(indexOfFirstRecord + index, 'description', e.target.value)}
                    />
                  </td>
                  <td>{new Date(articulo.Date).toLocaleDateString()}</td>
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(articulo._id)}>
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <Button onClick={prevPage} disabled={currentPage === 1}>
              Anterior
            </Button>
            <span style={{ margin: '0 10px' }}>
              Página {currentPage} de {totalPages}
            </span>
            <Button onClick={nextPage} disabled={currentPage === totalPages}>
              Siguiente
            </Button>
          </div>
        </Card.Body>
      </Card>

    <ModalCrearArticulo show={showModal} handleClose={handleCloseModal}/>

      {isLoading && (
        <div className="overlay">
          <Spinner className="custom-spinner" animation="border" />
        </div>
      )}

      {changedArticulos.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </div>
      )}
    </div>
  );
};

export default CrudArticulos;
