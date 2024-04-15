import React, { useState } from 'react';
import { Button, Col, Nav } from 'react-bootstrap';


const itemsPerPage = 13;
const totalItems = 26;
const totalPages = Math.ceil(totalItems / itemsPerPage);

const CarouselBar = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;

  const carouselButtons = () => {
    const calculateVisibleButtons = () => {
      const windowWidth = window.innerWidth;
      if (windowWidth >= 1200) {
        return 13;
      } else if (windowWidth >= 992) {
        return 10;
      } else if (windowWidth >= 768) {
        return 7;
      } else {
        return 5;
      }
    };
    const visibleButtonsCount = calculateVisibleButtons();
    const visibleImages = imageArray.slice(0, visibleButtonsCount);
    return visibleImages.map((imageUrl, index) => (
      <Col key={index} xs={6} sm={4} md={3} lg={2} xl={2} className="mb-3">
        <Button>
          <img
            src={imageUrl}
            alt={`Item ${startItem + index}`}
            style={{ width: '30px', height: '30px', objectFit: 'cover' }}
          />
          <span>{`${startItem + index}`}</span>
        </Button>
      </Col>
    ));
  };
  const imageArray = [
    'https://i.ibb.co/5rF1gM4/Caba-a.png',
    'https://i.ibb.co/0hyRKtx/Casa-rodante.png',
    'https://i.ibb.co/p2SVBrM/Cueva.png',
    'https://i.ibb.co/bFVJJfp/Mansion.png',
    'https://i.ibb.co/G5nZDkY/Mini-casa.png',
    'https://i.ibb.co/w0R1HgV/Piscina.png',
    'https://i.ibb.co/fQFYjq5/Playa.png',
    'https://i.ibb.co/dDs4qbP/Vista-Asombrosa.png',
    'https://i.ibb.co/FDFPwrB/Extraordinario.png',
    'https://i.ibb.co/yQ5y9BY/Parques-nacionales.png',
    'https://i.ibb.co/Zmvm17V/Dise-o.png',
    'https://i.ibb.co/WPwL1cP/Surf.png',
    'https://i.ibb.co/hYVKQjC/Desierto.png'
  ];



  return (
    <div className="mt-3 d-flex flex-wrap justify-content-center align-items-center">
      <div id="navbarScroll">
        <Nav className="me-5">
          <Nav.Item className="dropdown ml-auto me-5">
            <div className="d-flex align-items-center">
              <Button onClick={handlePrevPage} className="btn btn-light mx-2">⬅️</Button>
              <div className="d-flex" style={{ flexWrap: 'nowrap' }}>
                {carouselButtons().map((button, index) => (
                  <span key={index} className={`mx-2`}>
                    {button}
                  </span>
                ))}
              </div>
              <Button onClick={handleNextPage} className="btn btn-light mx-2">➡️</Button>
            </div>
          </Nav.Item>
        </Nav>
      </div>
    </div>
  );
};

export default CarouselBar;