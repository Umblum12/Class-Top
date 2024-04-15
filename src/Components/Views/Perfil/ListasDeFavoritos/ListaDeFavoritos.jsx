import React, { useState, useEffect } from "react";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getCookie } from "../../../../utils/cookieUtils";
import { API_URL } from "../../../../config";

const ListasDeFavoritos = () => {
  const [clasesFavoritas, setClasesFavoritas] = useState([]);
  const navigate = useNavigate();
  const userId = getCookie("userId");
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (!userId) {
      // Si no hay userId, no podemos obtener la lista de favoritos, así que salimos de la función.
      return;
    }

    // Realizar la petición GET para obtener la lista de favoritos del usuario
    axios
      .get(
        `${API_URL}/usuarios/${userId}`
      )
      .then((response) => {
        setIsLoading(true);
        const userFavorites = response.data.isFavorite || [];

        // Realizar una consulta a la tabla de clases para obtener solo las clases con las IDs de favoritos del usuario
        axios
          .get(`${API_URL}/clases`)
          .then((response) => {
            
            const allClases = response.data;
            const favoritas = allClases.filter((clase) =>
              userFavorites.includes(clase._id)
            );
            setClasesFavoritas(favoritas);
            setIsLoading(false);
          })
          .catch((error) => {
            console.error("Error al obtener las clases:", error);
            setIsLoading(false);
            // Manejar el error según sea necesario
          });
      })
      .catch((error) => {
        console.error("Error al obtener la lista de favoritos:", error);
        setIsLoading(false);
        // Manejar el error según sea necesario
      });
  }, [userId]);

  const handleProductClick = (clase) => {
    navigate("/DetailView", { state: { product: clase } });
  };

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        marginTop: "150px",
      }}
    >
      <Container>
        <Card>
          <h1 className="text-4xl font-bold mb-6">Lista de favoritos</h1>
        </Card>
      </Container>
      <Container className="my-5">
        {clasesFavoritas.length === 0 ? (
          <p>No tienes clases en tu lista de favoritos.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {clasesFavoritas.map((clase) => (
              <div key={clase._id} className="col">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Img variant="top" src={clase.imageSrc[0].imageUrl} />
                  <Card.Body className="d-flex flex-column">
                    <h2 className="text-xl font-bold mb-2">{clase.title}</h2>
                    <h2 className="text-xl font-bold mb-2">{clase.name}</h2>
                    <p className="text-gray-600">{clase.description}</p>
                    <div className="mt-auto">
                      <Button
                        variant="primary"
                        onClick={() => handleProductClick(clase)}
                      >
                        Más detalles
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Container>
      {isLoading && (
        <div className="overlay">
          <Spinner className="custom-spinner" animation="border" />
        </div>
      )}
    </div>
    
  );
};

export default ListasDeFavoritos;
