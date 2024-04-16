import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faPlus,
  faSync,
  faTimes,
  faPencilAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Container, Card, Button, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import ModalCrearClase from "./Modales/ModalCrearClase";
import ModalEditarClase from "./Modales/ModalEditarClase"; // Importar el nuevo componente
import "react-toastify/dist/ReactToastify.css";
import {getCookie} from "../../../../utils/cookieUtils.js";
import { API_URL } from "../../../../config.jsx";



const CrearClasses = () => {
  const [registros, setRegistros] = useState([]);
  const [showCrearModal, setShowCrearModal] = useState(false); // Estado para mostrar el modal de crear
  const [showEditarModal, setShowEditarModal] = useState(false); // Estado para mostrar el modal de editar
  const [registroSeleccionado, setRegistroSeleccionado] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [perPage] = useState(10); // Número de registros por página
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const userId = getCookie("userId");

  useEffect(() => {
    const obtenerRegistros = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_URL}/clases`
        );
        const filteredRegistros = response.data.filter(
          (registro) => registro.userId === userId
        );
        setRegistros(filteredRegistros);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error al obtener los registros:", error);
      }
    };

    obtenerRegistros();
  }, [userId]);


  // Función para eliminar un registro
  const handleEliminar = async (id) => {
    try {
      toast.info(
        <div style={{ textAlign: "center" }}>
          <p>¿Estás seguro de eliminar este registro?</p>
          <Button
            variant="success"
            size="sm"
            className="ml-2"
            onClick={() => eliminarRegistro(id)}
          >
            Aceptar
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="ml-2"
            onClick={() => toast.dismiss()}
          >
            Cancelar
          </Button>
        </div>
      );
    } catch (error) {
      console.error("Error al eliminar el registro:", error);
      toast.error("Error al eliminar el registro");
    }
  };

  // Función para eliminar un registro después de la confirmación
  const eliminarRegistro = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${API_URL}/clases/${id}`
      );
      setRegistros(registros.filter((registro) => registro._id !== id));
      toast.success("¡Registro eliminado exitosamente!");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error al eliminar el registro:", error);
      toast.error("Error al eliminar el registro");
    }
  };

  // Función para abrir el modal de editar un registro
  const handleMostrarEditarModal = (registro) => {
    setRegistroSeleccionado(registro);
    setShowEditarModal(true);
  };

  // Función para cerrar los modales
  const handleCloseModal = () => {
    setShowCrearModal(false);
    setShowEditarModal(false);
  };

  // Calcular el índice del primer y último registro de la página actual
  const indexOfLastRecord = currentPage * perPage;
  const indexOfFirstRecord = indexOfLastRecord - perPage;
  const currentRecords = registros.slice(indexOfFirstRecord, indexOfLastRecord);

  // Calcular el número total de páginas
  const totalPages = Math.ceil(registros.length / perPage);

  // Funciones para cambiar de página
  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <div className="courses-container"
        style={{
          backgroundColor: "#f8f9fa",
          minHeight: "100vh",
          marginTop: "5px",
        }}
      >
        <Container style={{marginBottom: '20px'}}>
        <Card className="courses-container bg-dark text-light courses-container">
          <h1 className="text-4xl font-bold mb-6" >Mis Clases</h1>
        </Card>
        </Container>

        <Button
          className="btn"
          style={{
            backgroundColor: "green",
            color: "white",
            marginRight: "10px",
            marginBottom: "20px"
          }}
          onClick={() => setShowCrearModal(true)} // Abrir el modal de crear al hacer clic
        >
          <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
          Crear Nueva Clase
        </Button>
        <Table
          border="1"
          style={{ width: "100%", maxWidth: "800px", margin: "0 auto" }}
          className="table-primary table table-bordered border-primary "
        >
          <thead style={{ color: "red" }} >
            <tr>
              <th style={{ textAlign: "left" }}>ID</th>
              <th style={{ textAlign: "left" }}>Título</th>
              <th style={{ textAlign: "left" }}>Descripción</th>
              <th
                style={{
                  textAlign: "left",
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Categoría
              </th>
              <th style={{ textAlign: "left" }}>Ubicación</th>
              <th style={{ textAlign: "left" }}>Precio</th>
              <th style={{ textAlign: "left" }}>Acciones</th>
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {currentRecords.map((registro) => (
              <tr key={registro._id}>
                <td style={{ textAlign: "left" }}>{registro._id}</td>
                <td style={{ textAlign: "left" }}>{registro.title}</td>
                <td style={{ textAlign: "left" }}>{registro.description}</td>
                <td
                  style={{
                    textAlign: "left",
                    maxWidth: "150px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {registro.category.join(", ")}
                </td>
                <td style={{ textAlign: "left" }}>{registro.location}</td>
                <td style={{ textAlign: "left" }}>{registro.price}</td>
                <td>
                  <div
                    style={{
                      display: "flex",
                    }}
                  >
                    <button
                      onClick={() => handleEliminar(registro._id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        marginRight: "5px",
                        fontSize: "12px",
                        padding: "5px 10px",
                      }}
                    >
                      Eliminar
                    </button>
                    <Button
                      className="btn"
                      style={{
                        backgroundColor: "blue",
                        color: "white",
                        fontSize: "12px",
                        padding: "5px 10px",
                      }}
                      onClick={() => handleMostrarEditarModal(registro)} // Abrir el modal de editar al hacer clic
                    >
                      <FontAwesomeIcon
                        icon={faPencilAlt}
                        style={{ marginRight: "5px" }}
                      />{" "}
                      {/* Cambiado el icono a lápiz */}
                      Editar
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {/* Botones de paginación */}
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Button onClick={prevPage} disabled={currentPage === 1}>
            Anterior
          </Button>
          <span style={{ margin: "0 10px" }}>
            Página {currentPage} de {totalPages}
          </span>
          <Button onClick={nextPage} disabled={currentPage === totalPages}>
            Siguiente
          </Button>
        </div>
      </div>
      {/* Renderizar modales */}
      <ModalCrearClase show={showCrearModal} handleClose={handleCloseModal} />
      <ModalEditarClase
        show={showEditarModal}
        handleClose={handleCloseModal}
        registroSeleccionado={registroSeleccionado}
        setRegistros={setRegistros}
      />
      {/* Renderizar spinner de carga */}
      {isLoading && (
        <div className="overlay">
          <Spinner className="custom-spinner" animation="border" />
        </div>
      )}
    </div>
  );
};

export default CrearClasses;