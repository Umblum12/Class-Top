import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import axios from "axios";

function Verification() {
  // Obtener el valor del parámetro de la URL (correo electrónico)
  const { email } = useParams();
  const { hola } = useParams();
  // Estado para indicar si se ha verificado el correo gg
  const [isVerified, setIsVerified] = useState(false);

  // Función para manejar la verificación del correo
  const handleVerification = async () => {
    try {
      // Realizar una solicitud PATCH al backend para verificar el correo electrónico
      const response = await axios.patch(`/usuarios/verify/${email}`);
      // Si la solicitud es exitosa y el correo se verifica en el backend, actualizar el estado
      setIsVerified(true);
    } catch (error) {
      console.error('Error verifying email:', error);
      // Manejar cualquier error que ocurra durante la verificación del correo
    }
  };

  return (
    <Container style={{ marginTop: "5px" }}>
      <h1>Verificar Correo Electrónico</h1>
      <p>Correo Electrónico: {email}</p>
      {!isVerified ? (
        <Button onClick={handleVerification}>Verificar</Button>
      ) : (
        <p>¡El correo electrónico ha sido verificado!</p>
      )}
    </Container>
  );
}

export default Verification;
