import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Carousel,
  Button,
  Spinner,
  Dropdown
} from "react-bootstrap";
import { FaHeart } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { getCookie } from "../../../utils/cookieUtils";
import { API_URL } from "../../../config";

function ProductCarousel({ images, onClick }) {
  // Verificar si images es undefined o null
  if (!images || images.length === 0) {
    // Si no hay imágenes, mostrar una imagen predeterminada
    return (
      <img
        className="d-block w-100"
        src="https://www.shutterstock.com/image-photo/school-classroom-blur-background-without-600nw-426211699.jpg"
        alt="Imagen predeterminada"
      />
    );
  }

  return (
    <Carousel>
      {images.map((image, index) => (
        <Carousel.Item key={index} onClick={onClick}>
          <img
            className="d-block w-100"
            src={image.imageUrl} // Modificado para mostrar la URL de la imagen
            alt={`Slide ${index}`}
          />
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

function Categorias() {
  const [listings, setListings] = useState([]);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const userId = getCookie("userId");

  const [IsLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoading(true);
      axios
        .get(`${API_URL}/clases`)
        .then((response) => {
          setIsLoading(false);
          console.log(response);
          const listingsFromDB = response.data;
          setListings(listingsFromDB);
        })
        .catch((error) => {
          setIsLoading(false);
          console.error("Error fetching data:", error);
        });
      return;
    }
    setIsLoading(true);
    axios
      .get(
        `${API_URL}/usuarios/${userId}`
      )
      .then((response) => {
        const userData = response.data;
        const userFavorites = userData.isFavorite || [];

        axios
          .get(`${API_URL}/clases`)

          .then((response) => {
            setIsLoading(false);
            console.log(response);
            const listingsFromDB = response.data;

            const updatedListings = listingsFromDB.map((listing) => {
              const isAlreadyFavorite = userFavorites.includes(listing._id);
              return { ...listing, isAlreadyFavorite };
            });

            setListings(updatedListings);
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });
  }, [userId]);

  const handleProductClick = (listing) => {
    navigate("/DetailView", { state: { product: listing } });
  };

  const handleHeartClick = (product) => {
    const isFavorite = !product.isAlreadyFavorite;
    const wasFavoriteBefore = product.isAlreadyFavorite;
    const updatedListings = listings.map((listing) => {
      if (listing._id === product._id) {
        return { ...listing, isAlreadyFavorite: isFavorite };
      }
      return listing;
    });
    setListings(updatedListings);

    const newFavorites = updatedListings
      .filter((listing) => listing.isAlreadyFavorite)
      .map((listing) => listing._id);

    axios
      .patch(
        `${API_URL}/usuarios/${userId}`,
        { isFavorite: newFavorites }
      )
      .then((response) => {
        if (isFavorite) {
          toast.success("Clase agregada a favoritos");
          toast.info(
            <div>
              <span>¿Quieres ver la lista de favoritos ahora?</span>
              <br></br>
              <Button
                variant="info"
                size="sm"
                className="ml-2"
                onClick={() => navigate("/ListasDeFavoritos")}
              >
                Ver Favoritos
              </Button>
            </div>
          );
        } else {
          if (wasFavoriteBefore) {
            toast.error("Clase eliminada de favoritos");
          } else {
            toast.error("Clase no estaba en favoritos");
          }
        }
      })
      .catch((error) => {
        console.error("Error updating favorites:", error);
        const revertedListings = listings.map((listing) => {
          if (listing._id === product._id) {
            return { ...listing, isAlreadyFavorite: !isFavorite };
          }
          return listing;
        });
        setListings(revertedListings);
        toast.error(
          "Error al agregar la clase a favoritos. Por favor, inténtalo de nuevo."
        );
      });
  };

  const chunkArray = (arr, size) => {
    const chunkedArr = [];
    for (let i = 0; i < arr.length; i += size) {
      chunkedArr.push(arr.slice(i, i + size));
    }
    return chunkedArr;
  };

  const listingsChunks = chunkArray(listings, 2);

  return (
    <div className="courses-container" style={{ marginTop: "125px" }}>
      <Container>
        <h1 className="text-4xl font-bold mb-6 ">Lista de clases</h1>
      </Container>
      <Container>
        <Container>
          <div className="mt-3 d-flex justify-content-center align-items-center">
            <div className="d-flex flex-row bd-highlight">
              <div className="p-2 bd-highlight">
                <input
                  placeholder="Locación"
                  className="form-control border-end-0 border rounded-pill"
                  style={{ marginRight: "10px" }}
                ></input>
              </div>
              <div className="p-2 bd-highlight">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  placeholderText="Fecha inicio"
                  className="form-control border-end-0 border rounded-pill"
                  style={{ marginRight: "10px" }}
                />
              </div>
              <div className="p-2 bd-highlight">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => setEndDate(date)}
                  placeholderText="Fecha finalización"
                  className="form-control border-end-0 border rounded-pill"
                  style={{ marginRight: "10px" }}
                />
              </div>
              <div className="p-2 bd-highlight">
                <input
                  placeholder="Alumnos"
                  className="form-control border-end-0 border rounded-pill"
                  style={{ marginRight: "20px" }}
                ></input>
              </div>

              <div className="p-2 bd-highlight">
                <Dropdown>
                  <Dropdown.Toggle
                    className="form-control border-end-0 border rounded-pill"
                    id="dropdown-basic"
                    style={{ color: "black", backgroundColor: "white" }}
                  >
                    Modalidad
                  </Dropdown.Toggle>

                  <Dropdown.Menu>
                    <Dropdown.Item>Estancias</Dropdown.Item>
                    <Dropdown.Item>Experiencias</Dropdown.Item>
                    <Dropdown.Item>Experiencias en linea</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              <div className="p-2 bd-highlight">
                <Button
                  type="button"
                  className="btn btn-primary border-start-0 rounded-pill"
                >
                  <FontAwesomeIcon icon={faSearch} />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Container>
      <Container fluid className="py-5">
        {listingsChunks.map((chunk, index) => (
          <Row key={index} className="g-4">
            {chunk.map((listing) => (
              <Col key={listing._id} xs={12} md={6}>
                <div className="course smaller-card">
                  <div
                    className="d-flex align-items-center course-preview"
                    style={{ height: "370px" }}
                  >
                    <FaHeart
                      style={{
                        position: "absolute",
                        top: "5px",
                        right: "5px",
                        color: getCookie("token")
                          ? listing.isAlreadyFavorite
                            ? "red"
                            : "grey"
                          : "grey",
                        cursor: getCookie("token") ? "pointer" : "not-allowed",
                        zIndex: 1,
                      }}
                      size={20}
                      onClick={() =>
                        getCookie("token") && handleHeartClick(listing)
                      }
                    />
                    <div
                      style={{
                        minWidth: "250px",
                        maxHeight: "1000px",
                        height: "110%",
                        overflow: "auto",
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(155, 155, 155, 0.5) rgba(255, 255, 255, 0.2)"
                      }}
                    >
                      <ProductCarousel
                        className="d-block"
                        images={listing.imageSrc}
                        onClick={() => handleProductClick(listing)}
                      />
                    </div>
                  </div>
                  <div className="course-info">
                    <h5>
                      <b>{listing.title}</b>
                    </h5>
                    <h6>{listing.name}</h6>
                    <p  className="overflow-auto" style={{ overflow: 'scroll', height: '150px' }}>
        {listing.description}
      </p>

                    <Button
                      variant="primary"
                      onClick={() => handleProductClick(listing)}
                    >
                      Ver más detalles
                    </Button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        ))}
      </Container>

      {IsLoading && (
        <div className="overlay">
          <Spinner className="custom-spinner" animation="border" />
        </div>
      )}
    </div>
  );
}

export default Categorias;
