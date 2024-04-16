import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Image,
  Spinner,
} from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getCookie } from "../../../utils/cookieUtils";
import axios from "axios";
import { API_URL } from "../../../config";

const DEFAULT_IMAGE_URL =
  "https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg";

const DetailView = () => {
  const [product, setProduct] = useState(null);
  const [isFixed, setIsFixed] = useState(false);
  const [isPurchased, setIsPurchased] = useState(null);
  const [user, setUser] = useState(null);
  const [classStatistics, setClassStatistics] = useState(null);
  const navigate = useNavigate();
  const token = getCookie("token");
  const location = useLocation();
  const userId = getCookie("userId");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Obtiene el producto del estado de ubicación
    if (location.state && location.state.product) {
      setProduct(location.state.product);
    }
    const handleScroll = () => {
      const offset = window.scrollY;
      // Puedes ajustar el valor 100 según sea necesario para determinar cuándo quieres que el componente se vuelva fijo
      if (offset > 450) {
        setIsFixed(true);
      } else {
        setIsFixed(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Limpia el listener del evento cuando el componente se desmonta
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.state]);

  useEffect(() => {
    fetchUserData(); // Always fetch user data when component mounts or product changes
  }, [product]);

  const getImagePerfil = (user) => {
    const usuario = user;
    if (usuario && usuario.isGift) {
      if (usuario.imagePerfil && usuario.imagePerfil.imageUrl) {
        return usuario.imagePerfil.imageUrl;
      } else {
        return DEFAULT_IMAGE_URL;
      }
    } else if (usuario && usuario.imagePerfil && usuario.imagePerfil.imageUrl) {
      return usuario.imagePerfil.imageUrl;
    } else {
      return DEFAULT_IMAGE_URL;
    }
  };

  const renderClassStatistics = () => {
    // Render class statistics if the logged-in user is the creator of the class
    if (product?.userId === userId && classStatistics) {
      return (
        <div>
          <h4>Estadisticas</h4>
          <p>Ventas: {classStatistics.sales}</p>
          <p>Alumnos: {classStatistics.usersPurchased.join(", ")}</p>
        </div>
      );
    }
    return null;
  };

  const fetchUserData = async () => {
    try {
      // Check if product and product.userId are both truthy
      if (product && product.userId) {
        const userResponse = await axios.get(
          `${API_URL}/usuarios/${product.userId}`,
          {timeout: 5000}
        );
        setUser(userResponse.data);

        const reservationResponse = await axios.get(`${API_URL}/reservations`);
        const isPurchased = reservationResponse.data.some(
          (reservation) =>
            reservation.listingsid === product._id &&
            reservation.userid === userId
        );

        setIsPurchased(isPurchased);
        console.log(isPurchased);
        // Check if the logged-in user is the creator of the class
        if (product.userId === userId) {
          // Calculate class statistics if the user is the creator
          const reservationsForClass = reservationResponse.data.filter(
            (reservation) => reservation.listingsid === product._id
          );
          const numberOfSales = reservationsForClass.length;
          const usersPurchasedIds = reservationsForClass.map(
            (reservation) => reservation.userid
          );

          // Fetch usernames for users who purchased the class
          const usersPurchasedPromises = usersPurchasedIds.map((userId) =>
            axios.get(`${API_URL}/usuarios/${userId}`)
          );
          const usersPurchasedResponses = await Promise.all(
            usersPurchasedPromises
          );
          const usersPurchased = usersPurchasedResponses.map(
            (response) => response.data.User
          );

          setClassStatistics({ sales: numberOfSales, usersPurchased });
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleSubmit = async (product) => {
    try {
      setIsLoading(true);
  
      if (isPurchased) {
        // Logic for cancelling purchase
        const response = await axios.delete(
          `${API_URL}/reservations/${userId}/${product._id}`
        );
        console.log("reservacion borrada we " + response.data);

        // Check if cancellation was successful
        if (response.status === 200) {
          setIsPurchased(false);
          console.log("Compra cancelada exitosamente");
          toast.success("Compra cancelada exitosamente");
        } else {
          // Handle cancel purchase error
          toast.error(
            "Error al cancelar la compra. Por favor, inténtalo de nuevo más tarde."
          );
        }
      } else {
        // Logic for creating a reservation
        const reservation = {
          listingsid: product._id, // Asegúrate de que el nombre de la clave sea correcto (listingId)
          userid: userId,
          date: product.date,
          detail: product.description,
        };
  
        const response = await axios.post(
          `${API_URL}/reservations`,
          reservation
        );
  
        // Check if reservation was successful
        if (response.status === 201) {
          setIsPurchased(true);
          console.log("¡Asistencia confirmada!");
          console.log(response.data);
          toast.success("¡Asistencia confirmada!");
        } else {
          // Handle reservation error
          toast.error(
            "Error al confirmar la asistencia. Por favor, inténtalo de nuevo más tarde."
          );
        }
      }
    } catch (error) {
      // Handle reservation or cancel purchase error
      console.error(
        "Error al confirmar la asistencia o cancelar la compra:",
        error
      );
      toast.error(
        "Error al confirmar la asistencia o cancelar la compra. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setIsLoading(false);
    }
  };
  

  if (!product || !product.imageSrc) {
    return null; // O maneja de otra forma si product no está definido
  }

  return (
    <div
      style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        marginTop: "200px",
      }}
    >
      <Container className="mt-5">
        <Row>
          {/* Main image on the left */}
          <Col md={6} className="text-center mt-5">
            {product.imageSrc.slice(0, 1).map((image, index) => (
              <div key={index + 1} className="col-6 mb-3">
                {image &&
                  image.imageUrl && ( // Verifica si image y image.imageUrl están definidos
                    <Image
                      src={image.imageUrl}
                      className="img-fluid object-cover rounded-md"
                      alt={`Product Image ${index + 2}`}
                      style={{
                        width: "100%",
                        height: "430px",
                        marginBottom: "8px",
                        minWidth: "600px",
                        borderRadius: "4px",
                        boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
                        border: "1px solid rgba(0,0,0,0.04)",
                      }}
                    />
                  )}
              </div>
            ))}
          </Col>
          {/* Additional images on the right */}
          <Col md={6} className="mt-5 d-flex flex-wrap justify-content-between">
            {product.imageSrc.slice(0, 4).map(
              (
                image,
                index // Ajustamos el slice para tomar solo las primeras 4 imágenes
              ) => (
                <div key={index} className="col-6 mb-3">
                  {image &&
                    image.imageUrl && ( // Verifica si image y image.imageUrl están definidos
                      <Image
                        src={image.imageUrl}
                        className="img-fluid object-cover rounded-md"
                        alt={`Product Image ${index + 1}`} // Incrementamos index en 1 para evitar índice 0
                        style={{
                          width: "100%",
                          height: "200px",
                          borderRadius: "4px",
                          boxShadow: "0 8px 28px rgba(0,0,0,0.28)",
                          border: "1px solid rgba(0,0,0,0.04)",
                        }}
                      />
                    )}
                </div>
              )
            )}
          </Col>
        </Row>
        {/* User and product information below images */}
        <Row className="mt-9">
          {/* Logged user info on the left */}
          {user && (
            <Col md={6}>
              <Card>
                <Card.Title>
                  <h2>Acerca del autor</h2>
                </Card.Title>
                <Card.Body>
                  <img
                    src={getImagePerfil(user)}
                    alt="Foto del autor"
                    style={{ height: "150px", width: "150px" }}
                    className="rounded-circle mb-4 img-fluid"
                  />
                  <h3>{user.User}</h3>
                  <p>
                    <strong>Email:</strong> {user.Mail}
                  </p>
                  <p>
                    <strong>Informacion:</strong> {product.description}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          )}
          {/* Product info and payment on the right */}
          <Col
            className="d-flex floatingCard"
            style={{
              position: isFixed ? "fixed" : "absolute",
              right: isFixed ? -15 : -15,
              top: isFixed ? 500 : "auto",
              transition: "transform 1s ease-in-out",
            }}
            md={6}
          >
            <Card>
              <Card.Body>
                <h3>{product.title}</h3>
                <p>
                  <strong>Ubicación:</strong> {product.location}
                </p>
                <p>
                  <strong>Tipo de alojamiento:</strong> Casa
                </p>
                <p>
                  <strong>Capacidad:</strong> {product.guestCount} Alumnos
                </p>
                <p>
                  <strong>Precio:</strong> {product.price} por el curso completo
                </p>
                {renderClassStatistics()}
                <Form className="mt-3">
                  {token && product.userId !== userId ? (
                    <Button
                      variant="primary"
                      onClick={() => handleSubmit(product)}
                    >
                      {isPurchased ? "Cancelar Compra" : "Pagar"}
                    </Button>
                  ) : (
                    !token && ( // Check only if token is not present (not logged in)
                      <div>
                        <ul>
                          <h5>Inicia sesión para obtener</h5>
                        </ul>
                      </div>
                    )
                  )}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {isLoading && (
        <div className="overlay">
          <Spinner className="custom-spinner" animation="border" />
        </div>
      )}
    </div>
  );
};

export default DetailView;
