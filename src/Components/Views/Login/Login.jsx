import React, { useRef, useState, useEffect } from "react";
import {
  faCheck,
  faTimes,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Modal, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';
import AlertService from '../../../Services/AlertService/AlertService';
import { jwtDecode } from "jwt-decode";
import User from '../../data/user.jsx';
import { setCookie } from '../../../utils/cookieUtils'; // Importa la función setCookie desde tu utilidad de cookies
import { API_URL } from "../../../config.jsx";

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = ({ show, handleClose, onLogin }) => {
  const userRef = useRef();
  const errRef = useRef();

  const [IsLoading, setIsLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [validName, setValidName] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [password, setPassword] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [role, setRole] = useState("");

  const [isLoginForm, setIsLoginForm] = useState(true);
  const [errMsg, setErrMsg] = useState("");
  const [success, setSuccess] = useState(false);

  const [isRegisterButtonDisabled, setIsRegisterButtonDisabled] =
    useState(true);
  const [isLoginButtonDisabled, setIsLoginButtonDisabled] =
    useState(true);

  useEffect(() => {
    // Check if userRef.current is available before calling focus
    if (userRef.current) {
      userRef.current.focus();
    }

    // Cleanup function to handle unmounting
    return () => {
      // Clean up any resources, if needed
    };
  }, []);


  useEffect(() => {
    setValidName(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPwd(PWD_REGEX.test(password));
    setValidMatch(password === matchPwd && PWD_REGEX.test(matchPwd));
  }, [password, matchPwd]);

  useEffect(() => {
    setValidEmail(EMAIL_REGEX.test(email));
  }, [email]);

  useEffect(() => {
    setErrMsg("");
  }, [username, password, matchPwd, email]);

  useEffect(() => {
    // Verificar si todos los campos son válidos
    var allFieldsValid =
      validName && validPwd && (isLoginForm || (validMatch && validEmail));

    // Actualizar el estado del botón de registro
    setIsRegisterButtonDisabled(!allFieldsValid);
  }, [validName, validPwd, validMatch, validEmail, isLoginForm]);


  useEffect(() => {
    // Verificar si todos los campos son válidos
    var allFieldsValid1 =
      validName && validPwd;

    // Actualizar el estado del botón de registro
    setIsLoginButtonDisabled(!allFieldsValid1);
  }, [validName, validPwd]);

  const handleLogin = () => {
    setIsLoading(true);

    axios
      .post(`${API_URL}/usuarios/login`, {
        username: username,
        password: password,
      })
      .then((response) => {
        setIsLoading(false);
        const { data } = response;
        if (data && data.token) {
          // Almacena el token en una cookie después de iniciar sesión
          setCookie('token', data.token, 7); // Cambia 'token' por el nombre de tu cookie de token
          const decodedToken = jwtDecode(data.token, { payload: true });
          setCookie('userId', decodedToken.userId, 7);

          AlertService.success('Inicio de sesión exitoso');
          onLogin(username);
          setIsRegisterButtonDisabled(true);
          handleClose();

          // Limpiar campos y reiniciar validaciones
          setUsername("");
          setPassword("");
          setMatchPwd("");
          setEmail("");
          setRole("");
          setValidName(false);
          setValidPwd(false);
          setValidMatch(false);
          setValidEmail(false);
          setIsLoginForm(true); // Volver al formulario de inicio de sesión
        } else {
          AlertService.error("Usuario o contraseña incorrectos");
        }
      })
      .catch((error) => {
        setIsLoading(false);
        console.error("Error al realizar la petición:", error);
        AlertService.error("Error al intentar iniciar sesión");
      });
  };


  const handleRegister = async () => {
    setIsLoading(true);
    // if button enabled with JS hack
    const v1 = USER_REGEX.test(username);
    const v2 = PWD_REGEX.test(password);
    const v3 = EMAIL_REGEX.test(email);

    if (!v1 || !v2) {
      setErrMsg("Invalid Entry");
      return;
    }
    try {
      const userData = {
        User: username,
        Password: password,
        Mail: email,
        Rol: 0,
      };

      // Hacer la petición para registrar al usuario
      const response = await axios.post(
        `${API_URL}/usuarios`,
        userData
      );
      if (response.status === 201) {
        // Registro exitoso
        AlertService.success("Registro exitoso");

        // Reiniciar estados y limpiar campos de entrada
        setUsername("");
        setPassword("");
        setMatchPwd("");
        setEmail("");
        setRole("");
        setValidName(false);
        setValidPwd(false);
        setValidMatch(false);
        setValidEmail(false);
        setIsRegisterButtonDisabled(true);
        setIsLoginForm(true); // Volver al formulario de inicio de sesión

        // Enviar correo electrónico de verificación
        await sendVerificationEmail(email);
        handleClose();
      } else {
        setIsLoading(false);
        // Error en la respuesta del servidor
        console.error("Error al registrar usuario:", response.statusText);
        AlertService.error(
          `Error: ${response.status} - ${response.statusText}`
        );
      }
    } catch (error) {
      setIsLoading(false);
      // Error de red u otro error
      console.error("Error durante el registro:", error.message);
      AlertService.error("Error durante el registro");
    }
  };

  const sendVerificationEmail = async (email) => {
    try {
      // Hacer la petición para enviar el correo de verificación
      await axios.post(
        `${API_URL}/usuarios/${email}`
      );
      AlertService.success("Correo de verificación enviado con éxito");
    } catch (error) {
      console.error("Error al enviar correo de verificación:", error.message);
      AlertService.error("Error al enviar correo de verificación");
    }
  };

  const handleToggleForm = () => {
    setIsLoginForm((prev) => !prev);
  };

  const handleModalClose = () => {
    // Limpiar campos y reiniciar validaciones
    setUsername("");
    setPassword("");
    setMatchPwd("");
    setEmail("");
    setRole("");
    setValidName(false);
    setValidPwd(false);
    setValidMatch(false);
    setValidEmail(false);
    setIsLoginForm(true);
    setIsLoginButtonDisabled(true);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleModalClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="text-center">
          {isLoginForm ? "Iniciar Sesión" : "Registrar"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <section>
          <p
            ref={errRef}
            className={errMsg ? "errmsg" : "offscreen"}
            aria-live="assertive"
          >
            {errMsg}
          </p>
          <form className="p-3">
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Usuario:
                {validName && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="valid"
                    style={{ color: "green" }}
                  />
                )}
                {!validName && username && (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="invalid"
                    style={{ color: "Red" }}
                  />
                )}
              </label>
              <input
                type="text"
                id="username"
                ref={userRef}
                autoComplete="off"
                onChange={(e) => setUsername(e.target.value)}
                required
                aria-invalid={!validName ? "true" : "false"}
                aria-describedby="uidnote"
                onFocus={() => setUserFocus(true)}
                onBlur={() => setUserFocus(false)}
                className="form-control"
              />
              {!validName && username && userFocus && (
                <p
                  id="uidnote"
                  className={
                    userFocus && username && !validName
                      ? "instructions"
                      : "offscreen"
                  }
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    style={{ color: "blue" }}
                  />
                  4 a 24 caracteres.
                  <br />
                  Debe comenzar con una letra.
                  <br />
                  Se permiten letras, números, guiones bajos y guiones.
                </p>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Contraseña:
                {validPwd && (
                  <FontAwesomeIcon
                    icon={faCheck}
                    className="valid"
                    style={{ color: "green" }}
                  />
                )}
                {!validPwd && password && (
                  <FontAwesomeIcon
                    icon={faTimes}
                    className="invalid"
                    style={{ color: "Red" }}
                  />
                )}
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!validPwd ? "true" : "false"}
                aria-describedby="pwdnote"
                onFocus={() => setPwdFocus(true)}
                onBlur={() => setPwdFocus(false)}
                required
                autoComplete="off"
              />
              {!validPwd && password && pwdFocus && (
                <p
                  id="pwdnote"
                  className={
                    pwdFocus && !validPwd ? "instructions" : "offscreen"
                  }
                >
                  <FontAwesomeIcon
                    icon={faInfoCircle}
                    style={{ color: "blue" }}
                  />
                  8 a 24 caracteres.
                  <br />
                  Debe incluir letras mayúsculas y minúsculas, un número y un
                  carácter especial.
                  <br />
                  Caracteres especiales permitidos:{" "}
                  <span aria-label="exclamation mark">!</span>{" "}
                  <span aria-label="at symbol">@</span>{" "}
                  <span aria-label="hashtag">#</span>{" "}
                  <span aria-label="dollar sign">$</span>{" "}
                  <span aria-label="percent">%</span>
                </p>
              )}
            </div>

            {!isLoginForm && (
              <>
                <div className="mb-3">
                  <label htmlFor="Confirmpassword" className="form-label">
                    Confirmar Contraseña:
                    {validMatch && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="valid"
                        style={{ color: "green" }}
                      />
                    )}
                    {!validMatch && matchPwd && (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="invalid"
                        style={{ color: "Red" }}
                      />
                    )}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="Confirmpassword"
                    onChange={(e) => setMatchPwd(e.target.value)}
                    aria-invalid={!validPwd ? "true" : "false"}
                    aria-describedby="pwdnote"
                    onFocus={() => setPwdFocus(true)}
                    onBlur={() => setPwdFocus(false)}
                    required
                    autoComplete="off"
                  />
                  {!validMatch && matchPwd && pwdFocus && (
                    <p
                      id="pwdnote"
                      className={
                        pwdFocus && !validMatch ? "instructions" : "offscreen"
                      }
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ color: "blue" }}
                      />
                      8 a 24 caracteres.
                      <br />
                      Debe incluir letras mayúsculas y minúsculas, un número y
                      un carácter especial.
                      <br />
                      Caracteres especiales permitidos:{" "}
                      <span aria-label="exclamation mark">!</span>{" "}
                      <span aria-label="at symbol">@</span>{" "}
                      <span aria-label="hashtag">#</span>{" "}
                      <span aria-label="dollar sign">$</span>{" "}
                      <span aria-label="percent">%</span>
                    </p>
                  )}
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Correo Electrónico:
                    {validEmail && (
                      <FontAwesomeIcon
                        icon={faCheck}
                        className="valid"
                        style={{ color: "green" }}
                      />
                    )}
                    {!validEmail && email && (
                      <FontAwesomeIcon
                        icon={faTimes}
                        className="invalid"
                        style={{ color: "Red" }}
                      />
                    )}
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    aria-invalid={!validEmail ? "true" : "false"}
                    aria-describedby="emailnote"
                    required
                    autoComplete="off"
                  />
                  {!validEmail && email && (
                    <p
                      id="emailnote"
                      className={
                        emailFocus && email && !validEmail
                          ? "instructions"
                          : "offscreen"
                      }
                    >
                      <FontAwesomeIcon
                        icon={faInfoCircle}
                        style={{ color: "blue" }}
                      />
                      Introduzca una dirección de correo electrónico válida.
                    </p>
                  )}
                </div>
                {/* Otros campos */}
              </>
            )}
            <div className="position-relative">
              <div className="d-grid">
                {isLoginForm ? (
                  <Button
                    variant="primary"
                    onClick={handleLogin}
                    disabled={isLoginButtonDisabled}>
                    Iniciar Sesión
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={handleRegister}
                    disabled={isRegisterButtonDisabled}
                  >
                    Registrar
                  </Button>
                )}
              </div>
            </div>
            <div className="text-center mt-3">
              <Button variant="link" onClick={handleToggleForm}>
                {isLoginForm
                  ? "¿No tienes cuenta? Regístrate aquí"
                  : "¿Ya tienes cuenta? Inicia sesión aquí"}
              </Button>
            </div>
          </form>
        </section>
      </Modal.Body>


      {IsLoading && (
        <div className="overlay">
          <Spinner className="custom-spinner" animation="border" />
        </div>
      )}
    </Modal>
  );
};

export default Login;