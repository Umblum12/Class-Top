import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import { API_URL } from "../../../../config";
const CentroDeAyuda = ({ }) => {

  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/articulo`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{
      backgroundColor: "#f8f9fa",
      minHeight: "100vh",
      marginTop: "200px"
    }}>
      <h1>Articulos más relevantes</h1>
      <p>{data.length} articulos</p>
      <ul>
          {data.map((item, index) => (
            <li key={index}>
              <Link to={`/articulo/${item._id}`}>{item.title}</Link>
            </li>
          ))}
        </ul>
        
    </div>
    
            


  );
};

export default CentroDeAyuda;