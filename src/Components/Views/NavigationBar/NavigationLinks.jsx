import React, { useState, useEffect } from 'react';
import { Nav, Breadcrumb } from 'react-bootstrap';
import { useLocation, Link } from "react-router-dom";

const NavigationLinks = () => {
    const location = useLocation();
    const [breadcrumbs, setBreadcrumbs] = useState([]);

    useEffect(() => {
        // Actualizar los breadcrumbs cuando cambia la ubicación
        updateBreadcrumbs();
    }, [location]);

    const updateBreadcrumbs = () => {
        // Obtener la ruta actual dividida por "/"
        const pathSegments = location.pathname.split('/').filter(Boolean);
        let currentPath = '';
        const updatedBreadcrumbs = pathSegments.map((segment, index) => {
            currentPath += `/${segment}`;
            return (
                <Breadcrumb.Item 
                    key={index} 
                    linkAs={Link} 
                    linkProps={{ to: currentPath }} 
                    className="btn btn-outline-info" // Aplicar clase btn-outline-info
                    style={{ margin: "0 5px" }} // Ajustar margen
                >
                    {segment}
                </Breadcrumb.Item>
            );
        });
        // Agregar el breadcrumb "Home" como primer elemento
        updatedBreadcrumbs.unshift(
            <Breadcrumb.Item 
                key="home" 
                linkAs={Link} 
                linkProps={{ to: "/" }} 
                className="btn btn-outline-info" // Aplicar clase btn-outline-info
                style={{ margin: "0 5px" }} // Ajustar margen
            >
                Home
            </Breadcrumb.Item>
        );
        setBreadcrumbs(updatedBreadcrumbs);
    };

    return (
        <>
            <Nav style={{ justifyContent: "center" }}> {/* Centrar elementos */}
                <Nav.Link
                    className="nav-link btn btn-outline-info"
                    style={{ marginRight: "25px" }}
                    aria-current="page"
                >
                    <Link to="/">
                    <span>
                        <img
                            src="https://i.ibb.co/Dr08YRc/Estancias.png"
                            alt=""
                            width="20"
                            height="25"
                        />
                    </span>{" "}
                        Home
                    </Link>
                </Nav.Link>
                <Nav.Link
                    className="nav-link btn btn-outline-info"
                    style={{ marginRight: "25px" }}
                    aria-current="page"
                >
                    <span>
                        <img
                            src="https://i.ibb.co/Ws3kmLf/Experiencias.png"
                            alt=""
                            width="20"
                            height="25"
                        />
                    </span>{" "}
                    Experiencias
                </Nav.Link>

                <Nav.Link
                    className="nav-link btn btn-outline-info"
                    href="#"
                    tabIndex="-1"
                    aria-disabled="true"
                >
                    <span>
                        <img
                            src="https://i.ibb.co/XZ7yQmF/experiencias-online.png"
                            alt=""
                            width="20"
                            height="25"
                        />
                    </span>{" "}
                    Experiencias en línea
                </Nav.Link>
            </Nav>
            <Breadcrumb>{breadcrumbs}</Breadcrumb>
        </>
    );
}

export default NavigationLinks;
