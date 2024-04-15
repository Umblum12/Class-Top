import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form } from 'react-bootstrap';

const CrudAlumnos = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosEditables, setUsuariosEditables] = useState([]);
  const [changedUsuarios, setChangedUsuarios] = useState([]);

  const obtenerUsuarios = async () => {
    try {
      const response = await axios.get('https://clon-airbnb-api-programmingsoft.koyeb.app/usuarios');
      setUsuarios(response.data);
      // Crear una copia editable de los usuarios recibidos
      setUsuariosEditables(response.data.map(usuario => ({ ...usuario })));
    } catch (error) {
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

    // Marcar el usuario como modificado
    if (!changedUsuarios.includes(index)) {
      setChangedUsuarios([...changedUsuarios, index]);
    }
  };

  const handleSaveChanges = async () => {
    try {
      console.log('Usuarios modificados:', changedUsuarios);
      
      await Promise.all(
        changedUsuarios.map(async (index) => {
          const usuarioId = usuariosEditables[index]._id;
          console.log('Actualizando usuario con ID:', usuarioId);
  
          // Verificar que el usuario exista antes de hacer la solicitud PUT
          const usuarioExistente = usuarios.find(user => user._id === usuarioId);
          if (!usuarioExistente) {
            console.error('El usuario con ID', usuarioId, 'no existe en la base de datos.');
            return; // Salir de la iteración si el usuario no existe
          }
  
          await axios.patch(`https://clon-airbnb-api-programmingsoft.koyeb.app/usuarios/${usuarioId}`, usuariosEditables[index]);
        })
      );
  
      setChangedUsuarios([]);
      obtenerUsuarios();
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
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

  return (
    <div style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", marginTop: "150px", padding: "20px" }}>
      <h1>Usuarios</h1>
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
          {usuariosEditables.map((usuario, index) => (
            <tr key={usuario._id}>
              <td>{usuario._id}</td>
              <td>
                <Form.Control
                  type="text"
                  value={usuario.User}
                  onChange={(e) => handleInputChange(index, 'User', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="password"
                  value={usuario.Password}
                  onChange={(e) => handleInputChange(index, 'Password', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  type="email"
                  value={usuario.Mail}
                  onChange={(e) => handleInputChange(index, 'Mail', e.target.value)}
                />
              </td>
              <td>
                <Form.Control
                  as="select"
                  value={usuario.Rol}
                  onChange={(e) => handleInputChange(index, 'Rol', e.target.value)}
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
      
      {changedUsuarios.length > 0 && (
        <Button variant="primary" onClick={handleSaveChanges}>
          Guardar Cambios
        </Button>
      )}
    </div>
  );
};

export default CrudAlumnos;
