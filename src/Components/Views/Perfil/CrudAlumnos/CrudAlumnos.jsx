import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Card, Spinner } from 'react-bootstrap';
import { toast } from "react-toastify";
const CrudAlumnos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosEditables, setUsuariosEditables] = useState([]);
  const [changedUsuarios, setChangedUsuarios] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);

  const obtenerUsuarios = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('https://clon-airbnb-api-programmingsoft.koyeb.app/usuarios');
      setUsuarios(response.data);
      setUsuariosEditables(response.data.map(usuario => ({ ...usuario })));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error('Error al obtener usuarios:', error);
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, []);

  const handleInputChange = (index, fieldName, value) => {
    const updatedUsuarios = [...usuariosEditables];
    updatedUsuarios[index][fieldName] = value;
    setUsuariosEditables(updatedUsuarios);

    if (!changedUsuarios.includes(index)) {
      setChangedUsuarios([...changedUsuarios, index]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      await Promise.all(
        changedUsuarios.map(async (index) => {
          const usuarioId = usuariosEditables[index]._id;
          const usuarioExistente = usuarios.find(user => user._id === usuarioId);

          if (!usuarioExistente) {
            console.error('El usuario con ID', usuarioId, 'no existe en la base de datos.');
            return;
          }

          await axios.patch(`https://clon-airbnb-api-programmingsoft.koyeb.app/usuarios/${usuarioId}`, usuariosEditables[index]);
        })
      );

      setChangedUsuarios([]);
      obtenerUsuarios();
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

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`https://clon-airbnb-api-programmingsoft.koyeb.app/usuarios/${userId}`);
      obtenerUsuarios();
    } catch (error) {
      console.error('Error al eliminar el usuario:', error);
    }
  };

  const indexOfLastRecord = currentPage * perPage;
  const indexOfFirstRecord = indexOfLastRecord - perPage;
  const currentUsuarios = usuariosEditables.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(usuariosEditables.length / perPage);

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', marginTop: '5px', padding: '20px' }}>
      <Card>
        <Card.Body>
          <Card.Title className="text-center" style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '20px' }}>
            Usuarios
          </Card.Title>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Contraseña</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {currentUsuarios.map((usuario, index) => (
                <tr key={usuario._id}>
                  <td>{usuario._id}</td>
                  <td>
                    <Form.Control
                      type="text"
                      value={usuario.User}
                      onChange={(e) => handleInputChange(indexOfFirstRecord + index, 'User', e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="password"
                      value={usuario.Password}
                      onChange={(e) => handleInputChange(indexOfFirstRecord + index, 'Password', e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      type="email"
                      value={usuario.Mail}
                      onChange={(e) => handleInputChange(indexOfFirstRecord + index, 'Mail', e.target.value)}
                    />
                  </td>
                  <td>
                    <Form.Control
                      as="select"
                      value={usuario.Rol}
                      onChange={(e) => handleInputChange(indexOfFirstRecord + index, 'Rol', e.target.value)}
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Admin</option>
                    </Form.Control>
                  </td>
                  <td>
                    <Button variant="danger" onClick={() => handleDelete(usuario._id)}>
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

      {isLoading && (
        <div className="overlay">
          <Spinner className="custom-spinner" animation="border" />
        </div>
      )}

      {changedUsuarios.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button variant="primary" onClick={handleSaveChanges}>
            Guardar Cambios
          </Button>
        </div>
      )}
    </div>
  );
};

export default CrudAlumnos;
