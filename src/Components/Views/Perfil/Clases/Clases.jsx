import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Card, Button, Spinner } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { getCookie } from "../../../../utils/cookieUtils";
import { API_URL } from "../../../../config";
const Clases = ({}) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [matchingClases, setMatchingClases] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${API_URL}/reservations`
        );
        const userId = getCookie("userId");
        const filteredClases = response.data.filter(
          (clase) => clase.userid === userId
        );

        console.log(filteredClases);
        // Fetch details of each listing using listingsid
        const promises = filteredClases.map((clase) =>
          axios.get(
            `${API_URL}/clases/${clase.listingsid}`
          )
        );

        // Wait for all API calls to finish
        const listingResponses = await Promise.all(promises);
        // Extract imageUrl from each listing and add it to the clase object
        const clasesWithImageUrl = filteredClases.map((clase, index) => ({
          ...clase,
          imageUrl: listingResponses[index].data.imageSrc[0].imageUrl,
          title: listingResponses[index].data.title
        }));

        setMatchingClases(clasesWithImageUrl);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id) => {
    try {
      setIsLoading(true);
      await axios.delete(
        `${API_URL}/reservations/${id}`
      );
      setMatchingClases(matchingClases.filter((clase) => clase._id !== id));
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("Error al eliminar el registro:", error);
    }
  };
  const handleDetalles = async (listingId) => {
    try {
      setIsLoading(true);
      const response = await axios.get(
        `${API_URL}/clases/${listingId}`
      );
      const product = response.data;
      navigate("/DetailView", { state: { product: product } });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error("ohñyooooo", error);
    }
  };

  return (
    <div className="courses-container"
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        marginTop: "150px",
      }}
    >
      <Container >
        <Card className="courses-container bg-dark text-light courses-container">
          <h1 className="text-4xl font-bold mb-6">Lista de clases</h1>
        </Card>
      </Container>
      <Container className="my-5">
        {matchingClases.length === 0 ? (
          <p>No estás inscrito en ninguna clase.</p>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4 g-4">
            {matchingClases.map((clase) => (
              <div key={clase.listingId} className="col">
                <Card className="border-0 shadow-sm h-100">
                  {/* Image */}
                  <img
                    src={clase.imageUrl}
                    className="card-img-top"
                    alt="Clase"
                  />

                  <Card.Body className="d-flex flex-column">
                  <h2 className="text-xl font-bold mb-2">{clase.title}</h2>
                    <h2 className="text-xl font-bold mb-2">{clase.date}</h2>
                    <p className="text-gray-600">{clase.detail}</p>
                    <div className="mt-auto">
                      <Button
                        variant="primary"
                        onClick={() => handleDetalles(clase.listingsid)}
                      >
                        Más detalles
                      </Button>
                      <Button
                      className="btn btn-outline-danger mt-3"
                      onClick={() => handleDelete(clase._id)}
                    >
                      Borrar clase
                    </Button>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            ))}
          </div>
        )}

        {isLoading && (
          <div className="overlay">
            <Spinner className="custom-spinner" animation="border" />
          </div>
        )}
      </Container>
    </div>
  );
};

export default Clases;