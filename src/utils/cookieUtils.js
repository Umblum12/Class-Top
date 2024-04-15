// cookieUtils.js

// Función para establecer una cookie
export const setCookie = (name, value, days) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = `; expires=${date.toUTCString()}`;
    }
    document.cookie = `${name}=${value || ''}${expires}; path=/`;
  };
  
  // Función para obtener el valor de una cookie
  export const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
  };
  
  // Función para eliminar una cookie
  export const eraseCookie = (name) => {
    document.cookie = `${name}=; Max-Age=-99999999;`;
  };
  