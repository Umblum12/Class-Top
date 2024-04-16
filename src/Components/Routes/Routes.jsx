import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
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

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Categorias />} />
      <Route path="/Categorias" element={<Categorias />} />
      <Route path="/DetailView" element={<DetialView />} />
      <Route path="/VerificacionCorreo/:email" element={<Verification />} />

      <Route element={<AuthService />}>
        <Route path="/AboutUs" element={<AboutUs />} />
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
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
