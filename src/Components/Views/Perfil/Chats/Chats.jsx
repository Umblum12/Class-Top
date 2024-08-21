import React, { useState, useEffect, useRef } from 'react';
import { Card, Image, Form, Button, Container, Row, Col, Spinner } from 'react-bootstrap';
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody, MDBTypography, MDBTextArea, MDBBtn, MDBCardHeader, MDBIcon } from "mdb-react-ui-kit";
import io from 'socket.io-client';
import axios from 'axios';
import { getCookie } from '../../../../utils/cookieUtils';
import EmojiPicker from '@emoji-mart/react';
import { Data } from 'emoji-mart';
import Logo from "../../../../assets/Images/Logo_Class_Top.jpg";
import { API_URL } from '../../../../config';


const DEFAULT_IMAGE_URL = 'https://www.shutterstock.com/image-vector/blank-avatar-photo-place-holder-600nw-1095249842.jpg';

const Chats = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [usuariosChat, setUsuariosChat] = useState([]);
  const [chatRoomId, setChatRoomId] = useState([]);
  const [messageThread, setMessageThread] = useState([]);
  const [messageContent, setMessageContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [userName, setUserName] = useState('');
  const scrollMe = useRef(null);
  const socket = useRef(null);
  const userId = getCookie("userId");
  const token = getCookie("token");
  const [isLoading, setIsLoading] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const getImagePerfil = (remitente) => {
    const usuario = usuarios.find(usuario => usuario._id === remitente);
    if (usuario && usuario.imagePerfil) {
      return usuario.imagePerfil;
    } else {
      return DEFAULT_IMAGE_URL;
    }
  };

  // Función para generar un identificador único para la sala de chat privada
  const generateChatRoomId = (userId1, userId2) => {
    // Ordenar los IDs de usuario alfabéticamente
    const sortedIds = [userId1, userId2].sort();

    // Unir los IDs de usuario con un separador
    const roomId = sortedIds.join('_');

    return roomId;
  };


  useEffect(() => {
    setIsLoading(true); // Establecer isLoading en true antes de la solicitud
    // Realizar la petición para obtener el usuario por su ID
    axios.get(`${API_URL}/usuarios/${userId}`)
      .then(response => {
        // Obtener el nombre del usuario del objeto de respuesta
        const usern = response.data.User;
        const userid = response.data._id;
        console.log(usern);
        socket.current = io(`${API_URL}`, {
          auth: {
            token: token,
            name: usern,
            userId: userid,
          }
        });
        setIsLoading(false); // Establecer isLoading en false después de la solicitud exitosa
      })
      .catch(error => {
        console.error("Error al obtener los datos del usuario:", error);
        setIsLoading(false); // Establecer isLoading en false después de la solicitud fallida
      });
  }, []);
  


      useEffect(() => {
        if (socket.current) {
          socket.current.on('usuarioConectado', ({ userId, online }) => {
            if (usuariosChat.some(usuario => usuario._id === userId)) {
              setUsuariosChat(prevUsuarios => prevUsuarios.map(usuario => {
                if (usuario._id === userId) {
                  return { ...usuario, online };
                }
                return usuario;
              }));
            }
          });

          socket.current.on('usuarioDesconectado', ({ userId, online }) => {
            if (usuariosChat.some(usuario => usuario._id === userId)) {
              setUsuariosChat(prevUsuarios => prevUsuarios.map(usuario => {
                if (usuario._id === userId) {
                  return { ...usuario, online };
                }
                return usuario;
              }));
            }
          });
        }
      }, [usuariosChat]);


      useEffect(() => {
        axios.get(
          `${API_URL}/usuarios`
        )
          .then(response => {
            const usuariosConImagen = response.data.map(usuario => ({
              ...usuario,
              imagePerfil: usuario.imagePerfil ? usuario.imagePerfil.imageUrl : DEFAULT_IMAGE_URL,
            }));
            setUsuarios(usuariosConImagen);
            setLoading(false);
          })
          .catch(error => {
            console.error('Error al obtener usuarios:', error);
          });
      }, []);


      useEffect(() => {
        if (socket.current) {
          socket.current.on('mensajeserver', (message) => {
            console.log(message);
            // Verificar si el mensaje ya existe en el estado messageThread
            const messageExists = messageThread.find(msg => 
              msg.contenido === message.contenido && 
              msg.remitenteUsuario === message.remitenteUsuario && 
              msg.destinatarioUsuario === message.destinatarioUsuario
            );
            // Agregar el mensaje solo si no existe en el estado messageThread
            if (!messageExists) {
              setMessageThread(prevMessages => [...prevMessages, message]);
            }
          });
        }
      }, [messageThread]);
      

     useEffect(() => {
      // Filtrar el usuario actual de la lista de usuarios del chat
      setUsuariosChat(usuarios.filter(usuario => usuario._id !== userId));
    }, [usuarios, userId]);

    const handleEmojiSelect = (emoji) => {
      setMessageContent(prevContent => prevContent + ' ' + emoji);
    };

    const handleUserClick = (userId3) => {
      setSelectedUser(userId3);
      console.log("Usuario seleccionado:", userId3);
      // Obtener el otro usuario en la conversación
      const otherUserId = userId;
      // Generar el identificador único de la sala de chat privada
      const chatRoomId1 = generateChatRoomId(userId3, otherUserId);
      setChatRoomId(chatRoomId1);
      console.log("Identificador de la sala de chat privada:", chatRoomId1);
    };


    const enviarMensaje = () => {
      setIsButtonDisabled(true);
      if (messageContent.trim() === '' || !selectedUser) {
        return;
      }
      const nuevoMensaje = {
        contenido: messageContent,
        remitenteUsuario: userId,
        destinatarioUsuario: selectedUser,
        chatRoomId: chatRoomId, // Enviar el chatRoomId junto con el mensaje
        messageSent: new Date().toISOString(),
      };
      // Emitir el mensaje al servidor de sockets
      if (socket.current) {
        socket.current.emit('mensaje', nuevoMensaje);
      }
      setMessageContent('');
      setIsButtonDisabled(false);
    };

          // Efecto para obtener mensajes del servidor
  useEffect(() => {
    if (selectedUser && chatRoomId) {
      axios.get(`${API_URL}/chat/chatRoom/${chatRoomId}`)
        .then(response => {
          setMessageThread(response.data); // Establecer los mensajes en el estado
        })
        .catch(error => {
          console.error('Error al obtener mensajes:', error);
        });
    }
  }, [selectedUser, chatRoomId]); // Dependencias: Ejecutar cuando cambie selectedUser o chatRoomId

  // Efecto para hacer scroll hacia abajo
  useEffect(() => {
    if (scrollMe.current) {
      scrollMe.current.scrollTop = scrollMe.current.scrollHeight;
    }
  }, [messageThread]); // Dependencia: Ejecutar cuando cambie messageThread



  return (
    <div>
    <MDBContainer fluid className=" courses-container" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh", marginTop: "5px" }}>
          <Container style={{marginBottom: '20px'}}>
        <Card className="courses-container bg-dark text-light courses-container">
          <h1 className="text-4xl font-bold mb-6" >Chat</h1>
        </Card>
        </Container>
      <MDBRow>
        <MDBCol md="4">
          <MDBCard className="courses-container">
            <MDBCardBody>
              <h5 className="font-weight-bold mb-3 text-center text-lg-start">
                Usuarios
              </h5>
              <MDBTypography listUnStyled className="mb-0" >
                {loading ? (
                  <div>Cargando usuarios...</div>
                ) : (
                  usuariosChat.map((usuario, index) => (
                    <li key={index} className={`p-2 border-bottom courses-container`} style={{ backgroundColor: selectedUser === usuario._id ? "#ddd" : "#eee" }}>
                      <a href="#!" className="d-flex justify-content-between" onClick={() => handleUserClick(usuario._id)}>
                        <div className="d-flex flex-row">
                          <img
                            src={usuario.imagePerfil}
                            alt={`Usuario ${index + 1}`}
                            className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                            width="60"
                          />
                          <div className="pt-1">
                            <p className="fw-bold mb-0">{usuario.User}</p>
                            <p className="small text-muted">
                              {usuario.online ? 'En línea' : 'Desconectado'}
                            </p>
                          </div>
                        </div>
                        <div className="pt-1">
                          <p className="small text-muted mb-1">Justo Ahora</p>
                        </div>
                      </a>
                    </li>
                  ))
                )}
              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="8">
          {selectedUser ? (
       <MDBCard className="courses-container">
       <MDBCardBody >
         <div className="mb-10">
           <h2>ClassTop Chat</h2>
           {messageThread.length === 0 && <div>No hay mensajes aún... saluda usando el cuadro de mensajes a continuación</div>}
         </div>
         <ul ref={scrollMe} className={`list-none chat ${messageThread.length > 0 ? '' : 'd-none'}`} style={{ overflow: 'scroll', height: '500px' }}>
           {messageThread.map((mensaje, index) => (
             <li key={index} className={`mb-10 pb-10 border-b-1 border-dotted border-gray-300 ${mensaje.remitenteUsuario === userId ? 'text-right' : 'text-left'}`}>
               <div className="flex">
                 <span className="chat-img">
                   <img
                     src={getImagePerfil(mensaje.remitenteUsuario)}
                     alt="imagen del usuario"
                     className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                     width="50"
                   />
                 </span>
                 <div className="chat-body">
                   <div className="header">
                     <small className="text-muted">
                       <span className="fa fa-clock-o">
                         {new Date(mensaje.messageSent).toLocaleString()}
                       </span>
                     </small>
                   </div>
                   <p>{mensaje.contenido}</p>
                 </div>
               </div>
             </li>
           ))}
         </ul>
       </MDBCardBody>
       <MDBCardHeader className="d-flex justify-content-between align-items-center">
  <Form.Control
    name="messageContent"
    required
    value={messageContent}
    onChange={(e) => setMessageContent(e.target.value)}
    type="text"
    className="form-control input-sm"
    placeholder="Enviar un mensaje privado"
  />
  <div className="d-flex me-2" >
    <div className="d-inline-block me-2">
      <Button color="secondary" rounded onClick={() => setPickerVisible(!isPickerVisible)}>
        😀
      </Button>
    </div>
    <div className="d-inline-block">
      <Button color="primary" rounded onClick={enviarMensaje}
      disabled={isButtonDisabled}>
        Enviar
      </Button>
    </div>
  </div>
  <div className={isPickerVisible ? 'd-block position-absolute' : 'd-none'} style={{ zIndex: 3, top: '180px', left: '399px' }}>
    <EmojiPicker
      data={Data}
      previewPosition='none'
      onEmojiSelect={(e) => {
        handleEmojiSelect(e.native);
        setPickerVisible(!isPickerVisible);
      }}
    />
  </div>
</MDBCardHeader>

     </MDBCard>
     
        
          ) : (
            <div style={{ textAlign: 'center', marginTop: '200px' }}>
              <img
                src={Logo}
                alt="Logo Clon Airbnb"
                style={{ width: '100px', height: '100px' }}
                className="d-inline-block align-top"
              />
              <h1>ClassTop Chat</h1>
            </div>
          )}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    {isLoading && (
      <div className="overlay" style={{ position: "fixed" }}>
        <Spinner className="custom-spinner" animation="border" />
      </div>
    )}
    </div>
  );
};

export default Chats;
