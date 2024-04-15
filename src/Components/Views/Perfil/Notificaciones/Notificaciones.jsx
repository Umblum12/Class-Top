import React, { useState } from "react";
import { Button, Table } from "react-bootstrap";
import Pagination from "react-bootstrap/Pagination";
import { Container, Card } from "react-bootstrap";

const Notificaciones = ({ }) => {
  const [container, setContainer] = useState("Unread");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    totalItems: 0,
    itemsPerPage: 10,
    currentPage: 1,
  });

  const loadMessages = () => {
    // Agregar lógica para cargar mensajes según el contenedor seleccionado
    // setLoading(true);
    // Simulación de carga de mensajes
    const mockMessages = [
      // ... mock data ...
    ];
    setMessages(mockMessages);
    // setLoading(false);
  };

  const pageChanged = (newPage) => {
    // Agregar lógica para cambiar de página
    setPagination({ ...pagination, currentPage: newPage });
    loadMessages();
  };

  const deleteMessage = (messageId) => {
    // Agregar lógica para eliminar mensaje por ID
    console.log(`Eliminando mensaje con ID: ${messageId}`);
  };

  return (
    <div className="container mx-auto mt-8"    
    style={{
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      marginTop: "150px",
    }}>
            <Container>
        <Card>
        <h1>Lista de Clases</h1>
        </Card>
      </Container>
      <br></br>
      <div className="mb-4 d-flex">
        <div className="btn-group" role="container">
          <Button
            variant="primary"
            btnRadio="Unread"
            onClick={() => {
              setContainer("Unread");
              loadMessages();
            }}
          >
            <i className="fa fa-envelope"></i> Unread
          </Button>
          <Button
            variant="primary"
            btnRadio="Inbox"
            onClick={() => {
              setContainer("Inbox");
              loadMessages();
            }}
          >
            <i className="fa fa-envelope-open"></i> Inbox
          </Button>
          <Button
            variant="primary"
            btnRadio="Outbox"
            onClick={() => {
              setContainer("Outbox");
              loadMessages();
            }}
          >
            <i className="fa fa-paper-plane"></i> Outbox
          </Button>
        </div>
      </div>

      <div className="row">
        {!messages || messages.length === 0 ? (
          <h3>No se encuentran mensajes</h3>
        ) : (
          <Table
            className="table table-hover"
            style={{ cursor: "pointer" }}
          >
            <thead>
              <tr>
                <th style={{ width: "40%" }}>Message</th>
                <th style={{ width: "20%" }}>From / To</th>
                <th style={{ width: "20%" }}>Sent / Received</th>
                <th style={{ width: "20%" }}></th>
              </tr>
            </thead>
            <tbody className="align-middle">
              {messages.map((message, index) => (
                <tr
                  key={index}
                  hidden={loading}
                  onClick={() => {
                    // Agregar lógica para redirigir o realizar acción al hacer clic en el mensaje
                  }}
                >
                  <td>{message.content}</td>
                  <td>
                    <div>
                      <img
                        className="img-circle rounded-circle me-2"
                        src={
                          container === "Outbox"
                            ? message.recipientPhotoUrl ||
                              "./assets/user.png"
                            : message.senderPhotoUrl || "./assets/user.png"
                        }
                        alt="recipient photo"
                      />
                      <strong>
                        {container === "Outbox"
                          ? message.recipientUsername
                          : message.senderUsername}
                      </strong>
                    </div>
                  </td>
                  <td>{message.messageSent}</td>
                  <td>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteMessage(message.id);
                      }}
                      className="btn btn-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>

      <div className="d-flex justify-content-center">
        {!loading && pagination && messages && messages.length > 0 && (
          <Pagination
            boundaryLinks={true}
            totalItems={pagination.totalItems}
            itemsPerPage={pagination.itemsPerPage}
            maxSize={10}
            activePage={pagination.currentPage}
            onSelect={(newPage) => pageChanged(newPage)}
            prev={<span>&lsaquo;</span>}
            next={<span>&rsaquo;</span>}
            first={<span>&laquo;</span>}
            last={<span>&raquo;</span>}
          />
        )}
      </div>
    </div>
  );
};

export default Notificaciones;
