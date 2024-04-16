import React from 'react';
import { Nav, Breadcrumb } from 'react-bootstrap';
import {  Link } from "react-router-dom";

const NavigationLinks = () => {
    

    return (
        <>
            <Nav > {/* Centrar elementos */}
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

        </>
    );
}

export default NavigationLinks;
