import React, { useState, useEffect } from "react";
import { Container, Button, Spinner, Card } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import { useCookies } from 'react-cookie';
import Logo from "../../../assets/Images/Logo_Class_Top.jpg";
import NavigationLinks from "./NavigationLinks";
import SearchMenu from "./SearchMenu";
import { eraseCookie, getCookie } from "../../../utils/cookieUtils";
import axios from "axios"; // Import axios
import { API_URL } from "../../../config";

import {
  Typography,
  List,
  ListItem,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  UserCircleIcon,
  PowerIcon,
  ChatBubbleBottomCenterTextIcon,
  HeartIcon,
  PlusCircleIcon,
  Bars4Icon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/solid";

const NavigationBar = ({ onLogout }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [profileUrl, setProfileUrl] = useState(null);
  const [isHiden, setIsHiden] = useState(false); // Estado para la barra lateral

  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  useEffect(() => {
    const token = cookies.token;
    const storedUsername = localStorage.getItem("username");
    if (token) {
      setLoggedInUser(storedUsername);
      setIsAuthenticated(true);
    }

    // Recupera el estado de la barra lateral desde localStorage
    const sidebarState = localStorage.getItem('isSidebarHidden');
    if (sidebarState) {
      setIsHiden(JSON.parse(sidebarState));
    }

  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userId = getCookie("userId");
      try {
        const response = await axios.get(`${API_URL}/usuarios/${userId}`);
        const { imagePerfil, Rol } = response.data;
        setIsAdminUser(Rol === "admin");
        setProfileUrl(response.data.imagePerfil.imageUrl);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setIsAdminUser(false);
      }
    };

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setIsAuthenticated(true);
    localStorage.setItem("username", username);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setIsAuthenticated(false);
    eraseCookie("token");
    eraseCookie("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("isPurchased");
    navigate('/');
    window.location.reload();
  };

  const handleClickburgir = () => {
    const newIsHiden = !isHiden;
    setIsHiden(newIsHiden);
    localStorage.setItem('isSidebarHidden', JSON.stringify(newIsHiden)); // Guarda el estado en localStorage
  };

  return (
    <div>
      {!isAuthenticated ? (
        <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#2b245b" }} fixed="top" className="flex-grow-1">
          <Container>
            <Navbar.Brand href="/" className="p-3">
              <img width="90" height="90" alt="Logo" src={Logo} />
            </Navbar.Brand>

            <Navbar.Toggle aria-controls="responsive-navbar-nav" />

            <Navbar.Collapse id="responsive-navbar-nav">
              <Container className="g-4">
                <NavigationLinks />
              </Container>

              <SearchMenu></SearchMenu>

              <div className="mr-6">
                <Button
                  className="btn btn-primary"
                  onClick={handleShowLoginModal}
                >
                  Iniciar Sesión
                </Button>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ) : (
        <div>
          <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: "#2b245b", zIndex: "299" }} fixed="top" className="flex-grow-1">
            <Container>
              <Navbar.Brand href="/" className="p-3">
                <img width="90" height="90" alt="Logo" src={Logo} />
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="responsive-navbar-nav" />
              <Navbar.Collapse id="responsive-navbar-nav">
                <Container className="g-4">
                  <NavigationLinks />
                </Container>
              </Navbar.Collapse>
            </Container>
            <div style={{ marginRight:"5vw" }}>
              <SearchMenu />
            </div>

            <Button
              className="btn btn-primary"
              onClick={handleClickburgir}
              style={{ marginRight:"5vw" }}
            >
              <Bars4Icon className="h-5 w-5" style={{ width:"2.5vw" }} />
            </Button>
          </Navbar>
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-md"
            style={{
              position: "fixed",
              right: 0,
              top: "auto",
              transition: "transform 1s ease-in-out",
              zIndex: 1999,
            }}>
            <Card style={{
              position: isHiden ? "fixed" : "absolute",
              right: isHiden ? -350 : 0,
              top: "138px",
              height: "100vh",
              width: "260px",
              backgroundColor: "#2b245b",
              transition: "transform 1s ease-in-out",
              
            }}>
              <Card.Body style={{ width: "100%", height: "auto" }} >
                <div className="">
                  {profileUrl && (
                    <img
                      src={profileUrl}
                      alt="Perfil de usuario"
                      className="rounded-circle mb-4 img-fluid"
                      style={{ marginBottom: '20px', height: '100px', width: '100px' }}
                    />
                  )}
                  <Typography variant="h5" color="blue-gray" style={{ color: "white" }}>
                    <span>{loggedInUser}</span>
                  </Typography>
                </div>
                
                <p className="overflow-auto" style={{ overflow: 'scroll', height: '550px' }}>
                  <List>
                    <Link to="/Chats">
                      <ListItem style={{ width: "100%", height: "auto" }}>
                        <ChatBubbleBottomCenterTextIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                        <span> Chat</span>
                      </ListItem>
                    </Link>
                    <Link to="/Clases">
                      <ListItem style={{ width: "100%", height: "auto" }}>
                        <ClipboardDocumentCheckIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                        <span>Asistencias</span>
                      </ListItem>
                    </Link>
                    <Link to="/ListasDeFavoritos">
                      <ListItem style={{ width: "100%", height: "auto" }}>
                        <HeartIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                        <span>Lista de favoritos</span>
                      </ListItem>
                    </Link>
              
                    <Link to="/Panel">
                      <ListItem style={{ width: "100%", height: "auto" }}>
                        <PresentationChartBarIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                        <span>Panel</span>
                      </ListItem>
                    </Link>
                    <Link to="/Cuenta">
                      <ListItem style={{ width: "100%", height: "auto" }}>
                        <UserCircleIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                        <span>Perfil</span>
                      </ListItem>
                    </Link>
                    <Link to="/CentroDeAyuda">
                      <ListItem style={{ width: "100%", height: "auto" }}>
                        <InformationCircleIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                        <span>Centro de ayuda</span>
                      </ListItem>
                    </Link>
                    <Link to="/CrearClasses">
                      <ListItem style={{ width: "100%", height: "auto" }}>
                        <PlusCircleIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                        <span>Pon tu clase en ClassTop</span>
                      </ListItem>
                    </Link>
                    {isAdminUser && (
                      <>
                        <Link to="/CrudAlumnos">
                          <ListItem style={{ width: "100%", height: "auto" }}>
                            <PlusCircleIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                            <span>Admin. Alumnos</span>
                          </ListItem>
                        </Link>
                        <Link to="/CrudArticulos">
                          <ListItem style={{ width: "100%", height: "auto" }}>
                            <PlusCircleIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                            <span>Admin. Articulos</span>
                          </ListItem>
                        </Link>
                      </>
                    )}

                    <ListItem style={{ width: "100%", height: "auto", color: "red" }} onClick={handleLogout}>
                      <PowerIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                      <span>Cerrar sesión</span>
                    </ListItem >
                  </List>
                </p>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}
      <div>
        <Login
          show={showLoginModal}
          handleClose={handleCloseLoginModal}
          onLogin={handleLogin}
        />

        {isLoading && (
          <div className="overlay" style={{ position: "fixed" }}>
            <Spinner className="custom-spinner" animation="border" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
