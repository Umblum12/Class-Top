import React, { useState, useEffect }  from 'react';
import { useLocation, Link ,BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Nav, Breadcrumb } from 'react-bootstrap';
import Categorias from '../Views/Categorias/Categorias';
import DetialView from '../Views/DetailView/DetialView';
import AboutUs from '../Views/AboutUs/AboutUs';
import Cuenta from '../Views/Perfil/Cuenta/Cuenta';
import Panel from '../Views/Perfil/Panel/Panel';
import Chats from '../Views/Perfil/Chats/Chats';
import Clases from '../Views/Perfil/Clases/Clases'
import ListasDeFavoritos from '../Views/Perfil/ListasDeFavoritos/ListaDeFavoritos'
import CrearClasses from '../Views/Perfil/CrearClasses/CrearClasses'
import CentroDeAyuda from '../Views/Perfil/CentroDeAyuda/CentroDeAyuda'
import CrudAlumnos from '../Views/Perfil/CrudAlumnos/CrudAlumnos'
import Articulo from '../Views/Perfil/CentroDeAyuda/Articulo';
import AuthService from '../../Services/AuthService';
import AuthAdmin from '../../Services/AuthAdmin';

import Verification from '../Views/Verification/Verification';
import CrudArticulos from '../Views/Perfil/CrudArticulos/CrudArticulos';

const AppRoutes = () => {
  
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  useEffect(() => {
      // Actualizar los breadcrumbs cuando cambia la ubicación
      updateBreadcrumbs();
  }, [location]);

  const updateBreadcrumbs = () => {
    // Define dynamic route segments
    const dynamicRoutes = {
        'articulo/:id': 'Articulo',
        // Add other dynamic routes if needed
    };

    // Get current path segments
    const pathSegments = location.pathname.split('/').filter(Boolean);

    // Check if the path contains 'articulo'
    const isArticuloPage = pathSegments.includes('articulo');

    let breadcrumbs = [];

    if (isArticuloPage) {
        // If the path contains 'articulo', only show "Home"
        breadcrumbs = [
          
            <Breadcrumb.Item
                key="home"
                linkAs={Link}
                linkProps={{ to: "/" }}
                className="btn btn-outline-secondary" // Apply class
                style={{ margin: "0 5px" }} // Adjust margin
            >
                Home
            </Breadcrumb.Item> ,
                 <Breadcrumb.Item
                 key="CentroDeAyuda"
                 linkAs={Link}
                 linkProps={{ to: "/CentroDeAyuda" }}
                 className="btn btn-outline-secondary" // Apply class
                 style={{ margin: "0 5px" }} // Adjust margin
             >
                 CentroDeAyuda
             </Breadcrumb.Item>
        ];
    } else {
        // Generate breadcrumbs normally
        let currentPath = '';

        breadcrumbs = pathSegments.map((segment, index) => {
            currentPath += `/${segment}`;

            // Check if the current segment matches any dynamic route pattern
            const isDynamicRoute = Object.keys(dynamicRoutes).some(route => {
                const routeSegments = route.split('/');
                if (routeSegments.length !== pathSegments.length) return false;

                return routeSegments.every((rSegment, i) =>
                    rSegment.startsWith(':') || rSegment === pathSegments[i]
                );
            });

            const displaySegment = isDynamicRoute ? dynamicRoutes[Object.keys(dynamicRoutes).find(route => {
                const routeSegments = route.split('/');
                if (routeSegments.length !== pathSegments.length) return false;

                return routeSegments.every((rSegment, i) =>
                    rSegment.startsWith(':') || rSegment === pathSegments[i]
                );
            })] : segment;

            return (
                <Breadcrumb.Item
                    key={index}
                    linkAs={Link}
                    linkProps={{ to: currentPath }}
                    className="btn btn-outline-secondary" // Apply class
                    style={{ margin: "0 5px" }} // Adjust margin
                >
                  
                    {displaySegment}
                </Breadcrumb.Item>
               
            );
        });

        // Add the breadcrumb "Home" as the first element
        breadcrumbs.unshift(
            <Breadcrumb.Item
                key="home"
                linkAs={Link}
                linkProps={{ to: "/" }}
                className="btn btn-outline-secondary" // Apply class
                style={{ margin: "0 5px" }} // Adjust margin
            >
                Home
            </Breadcrumb.Item>
        );
    }

    // Update the breadcrumbs state
    setBreadcrumbs(breadcrumbs);
};

      


  return (
    <>
        <Breadcrumb style={{marginTop:'12vh'}}>{breadcrumbs}</Breadcrumb>
    <Routes>
      <Route path="/" element={<Categorias />} />
      <Route path="/Categorias" element={<Categorias />} />
      <Route path="/DetailView" element={<DetialView />} />
      <Route path="/VerificacionCorreo/:email" element={<Verification />} />
      <Route path="/AboutUs" element={<AboutUs />} />
      <Route element={<AuthService />}>
        <Route path="/Panel" element={<Panel />} />
        <Route path="/Cuenta" element={<Cuenta />} />
        <Route path="/Chats" element={<Chats />} />
        <Route path="/Clases" element={<Clases />} />
        <Route path="/ListasDeFavoritos" element={<ListasDeFavoritos />} />
        <Route path="/CrearClasses" element={<CrearClasses />} />
        <Route path="/CentroDeAyuda" element={<CentroDeAyuda />} />
        <Route path="/articulo/:id" element={<Articulo />} />
        <Route element={<AuthAdmin />}>
          <Route path="/CrudAlumnos" element={<CrudAlumnos />} />
          <Route path="/CrudArticulos" element={<CrudArticulos />} />
        </Route>
      </Route>
      
    </Routes>

    </>
  );
  
};

export default AppRoutes;
