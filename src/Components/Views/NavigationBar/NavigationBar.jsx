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
} from "@heroicons/react/24/solid";

const NavigationBar = ({ onLogout }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [isAdminUser, setIsAdminUser] = useState(false);

  const [isHiden, setIsHiden] = useState(false);
  const handleShowLoginModal = () => setShowLoginModal(true);
  const handleCloseLoginModal = () => setShowLoginModal(false);

  useEffect(() => {
    const token = cookies.token;
    const storedUsername = localStorage.getItem("username");
    if (token) {
      setLoggedInUser(storedUsername);
      setIsAuthenticated(true);
    }

  }, []);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const userId = getCookie("userId");
      try {
        const response = await axios.get(`${API_URL}/usuarios/${userId}`);
        const verification = response.data.Rol === "admin";
        setIsAdminUser(verification);
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdminUser(false); // Set to false in case of an error
      }
    };

    if (isAuthenticated) {
      checkAdminStatus();
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
    if (isHiden === true) {
      setIsHiden(false);
    }else{
      setIsHiden(true);

    }
  };

  const SidebarWithContentSeparator = () => {
    const [open, setOpen] = React.useState(0);

    const handleOpen = (value) => {
      setOpen(open === value ? 0 : value);
    };

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
              </Navbar.Collapse>
            </Container>
            <div style={{ marginRight:"5vw" }}>
            <SearchMenu   ></SearchMenu>
            </div>

            <Button
                  className="btn btn-primary "
                  onClick={() => handleClickburgir()}
                  style={{ marginRight:"5vw"}}
                >
                    <Bars4Icon className="h-5 w-5" style={{ width:"2.5vw"}} />
                  
                </Button>
          </Navbar>
          <div className="fixed top-0 left-0 h-full w-64 bg-white shadow-md"
            style={{
              position: "fixed",
              right: 0,
              top: "auto",
              transition: "transform 1s ease-in-out",

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
                  <Typography variant="h5" color="blue-gray" style={{ color: "white" }}>
                  <span>{loggedInUser}</span>
                  </Typography>
                </div>
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
                  <Link to="/CrearClasses">
                    <ListItem style={{ width: "100%", height: "auto" }}>
                      <PlusCircleIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                      <span>Pon tu clase en ClassTop</span>
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
                  {isAdminUser && ( // Render only if user is admin
                  <>
                    <Link to="/Cuenta">
                      <ListItem style={{ width: "100%", height: "auto" }}>
                        <UserCircleIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
                        <span>Admin. Alumnos</span>
                      </ListItem>
                    </Link>
                    <Link to="/Cuenta">
                      <ListItem style={{ width: "100%", height: "auto" }}>
                        <UserCircleIcon className="h-5 w-5" style={{ width: "30%", height: "auto" }} />
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
          <div className="overlay">
            <Spinner className="custom-spinner" animation="border" />
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigationBar;
