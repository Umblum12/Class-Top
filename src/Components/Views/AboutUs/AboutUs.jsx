import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Card, ListGroup, Alert } from 'react-bootstrap';

function AboutUs() {
  return (
    <div className="alert alert-primary">
        
      <Container className="py-5">
        <h2 className="text-center mb-5">Acerca de Nosotros</h2>
        <Row>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Nuestra Misión</Card.Title>
                <Card.Text>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus fermentum mi vel arcu malesuada,
                  ac gravida leo fermentum. Integer nec turpis eget odio consequat convallis.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>Nuestra Visión</Card.Title>
                <Card.Text>
                  Nulla facilisi. Cras mattis congue quam. Fusce non orci id ligula commodo mollis. Proin ullamcorper
                  metus metus, eget consectetur neque tempus id.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        <Row className="mb-4">
          <Col>
            <Alert variant="primary">
              <h4>Nuestros Logros</h4>
              <ListGroup>
                <ListGroup.Item>200+ Clientes Satisfechos</ListGroup.Item>
                <ListGroup.Item>15 Premios de Excelencia</ListGroup.Item>
                <ListGroup.Item>1000+ Proyectos Completados</ListGroup.Item>
              </ListGroup>
            </Alert>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default AboutUs;
