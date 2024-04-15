import React, { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCookie } from '../utils/cookieUtils';
import AlertService from './AlertService/AlertService';

const AuthService = ({ redirectPath = '/' }) => {
  useEffect(() => {
    const canActivate = getCookie('token');
    if (!canActivate) {
      AlertService.error("Inicia seción para poder realizar esta acción");
    }
  }, []);

  return getCookie('token') ? <Outlet /> : <Navigate to={redirectPath} replace />;
};

export default AuthService;
