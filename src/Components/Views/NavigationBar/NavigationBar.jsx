import React, { useState, useEffect } from "react";
import { Container, Button, DropdownButton, Spinner } from "react-bootstrap";
import Navbar from "react-bootstrap/Navbar";
import Dropdown from "react-bootstrap/Dropdown";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import Login from "../Login/Login";
import { useCookies } from 'react-cookie';
import Logo from "../../../assets/Images/Logo_Class_Top.jpg";
import CarouselBar from "../CarouselBar/CarouselBar";
import NavigationLinks from "./NavigationLinks";
import SearchMenu from "./SearchMenu";
import { eraseCookie, setCookie } from "../../../utils/cookieUtils";

const NavigationBar = ({ onLogout }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cookies] = useCookies(['token']);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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

  const handleLogin = (username) => {
    setLoggedInUser(username);
    setIsAuthenticated(true);
    localStorage.setItem("username", username);
  };

  const handleLogout = () => {
    setIsLoading(true);
    setIsAuthenticated(false);
    eraseCookie("token");
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("isPurchased");
    navigate('/');
    window.location.reload();
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
                {!isAuthenticated ? (
                  <Button
                    className="btn btn-primary"
                    onClick={handleShowLoginModal}
                  >
                    Iniciar Sesión
                  </Button>
                ) : (
                  <DropdownButton
                    id="dropdown-item-button"
                    title={
                      <span>
                        <FontAwesomeIcon icon={faUser} />
                        {isAuthenticated && loggedInUser && (
                          <span> {loggedInUser}</span>
                        )}
                      </span>
                    }
                    className="custom-dropdown"
                  >
                    <Link to="/Chats">
                      <Dropdown.Item as="button">
                        Chats
                      </Dropdown.Item>
                    </Link>
                    <Link to="/Clases">
                      <Dropdown.Item as="button">
                        Clases
                      </Dropdown.Item>
                    </Link>
                    <Link to="/ListasDeFavoritos">
                      <Dropdown.Item as="button">
                        Lista de favoritos
                      </Dropdown.Item>
                    </Link>
                    <hr className="bg-white" />
                    <Link to="/CrearClasses">
                      <Dropdown.Item as="button">
                        Pon tu clase en ClassTop
                      </Dropdown.Item>
                    </Link>
                    <Link to="/Cuenta">
                      <Dropdown.Item as="button">
                        Cuenta
                      </Dropdown.Item>
                    </Link>
                    <Link to="/Panel">
                      <Dropdown.Item as="button">
                        Panel
                      </Dropdown.Item>
                    </Link>
                    <hr className="bg-white" />
                    <Link to="/CrudAlumnos">
                      <Dropdown.Item as="button">
                        Crud Alumnos
                      </Dropdown.Item>
                    </Link>
                    <Link to="/CentroDeAyuda">
                      <Dropdown.Item as="button">
                        Centro de ayuda
                      </Dropdown.Item>
                    </Link>
                    <Dropdown.Item as="button" onClick={handleLogout}>
                      Cerrar Sesión
                    </Dropdown.Item>
                  </DropdownButton>
                )}
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      ) : (
        <h1>hola</h1>
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
