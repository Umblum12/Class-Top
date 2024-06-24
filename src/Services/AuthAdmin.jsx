import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import axios from 'axios';
import AlertService from './AlertService/AlertService';
import { getCookie } from '../utils/cookieUtils';
import { API_URL } from '../config';
const AuthAdmin = ({ redirectPath = '/' }) => {
  const [rol, setRol] = useState('loading');

  useEffect(() => {
    const userId = getCookie('userId');
    axios.get(`${API_URL}/${userId}`)
      .then(response => {
        const userRol = response.data.Rol;
        setRol(userRol);
      })
      .catch(error => {
        setRol('error');
        AlertService.error("Error al obtener el rol del usuario");
      });
  }, []);

  if (rol === 'loading') {
    return null; // Muestra un loader o un mensaje de espera mientras se carga el rol
  }

  if (rol === 'admin') {
    return <Outlet />;
  }

  if (rol === 'error') {
    return <Navigate to={redirectPath} replace />;
  }

  // Si el rol no es ni 'admin' ni 'loading' ni 'error', redirecciona a la ruta predeterminada
  return <Navigate to={redirectPath} replace />;
};

export default AuthAdmin;
