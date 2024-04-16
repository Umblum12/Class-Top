import React, { useState, useEffect } from "react";
import axios from 'axios';
import {useParams} from 'react-router-dom';
import { API_URL } from "../../../../config";
const Articulo = ({ }) => {
  const { id } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await axios.get(`${API_URL}/articulo/${id}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching item data:', error);
      }
    };

    fetchArticle();
  }, [id]);

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Return empty string if dateString is falsy
    const date = new Date(dateString);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <div style={{
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        marginTop: "200px"
      }}>
        <h1>{data.title}</h1>
        <p>{formatDate(data.Date)}
        </p>
        <p>{data.description}</p>
        <div style={{ display: "flex", flexWrap: "wrap"}}>
          {data.imageSrc && data.imageSrc.map((imageUrl, index) => (
            <div key={index} style={{ width: "200px", height: "200px", margin: "10px", overflow: "hidden" }}>
              <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src={imageUrl} alt={`Image ${index + 1}`} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articulo;