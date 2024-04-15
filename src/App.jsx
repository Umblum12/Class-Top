// App.jsx
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import AppRoutes from './Components/Routes/Routes';
import 'bootstrap';
import './App.css';
import NavigationBar from './Components/Views/NavigationBar/NavigationBar';
import Footer from './Components/Views/Footer/Footer';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <div>
        <NavigationBar />
        <AppRoutes />
        <Footer />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default App;
