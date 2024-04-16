import React, { useState, useEffect, useRef } from "react";
import { Container, Card, Row } from "react-bootstrap";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, LineElement, PointElement, LinearScale, Title, CategoryScale, BarElement, LineController, BarController, DoughnutController } from "chart.js";
import { API_URL } from "../../../../config";
import axios from "axios";
import { getCookie } from "../../../../utils/cookieUtils";
import { Link, useNavigate } from "react-router-dom";
const Panel = () => {
  // Datos para los gráficos
  ChartJS.register(ArcElement, Tooltip, Legend, LineElement, PointElement, BarElement, LinearScale, Title, CategoryScale, LineController, BarController, DoughnutController);

  // Initialize state variables for chart data and loading state
  const [mostSoldClasses, setMostSoldClasses] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const fetchMostSoldClasses = async () => {
    try {
      setIsLoading(true);
      const userId = getCookie("userId"); // Implement your logic to get the current user's ID
      const response = await axios.get(`${API_URL}/clases`);
      const userClasses = response.data.filter((clase) => clase.userId === userId);
      userClasses.sort((a, b) => b.sales - a.sales); // Sort classes by sales in descending order

      setMostSoldClasses(userClasses.slice(0, 5)); // Set the top 5 most sold classes
      console.log(userClasses);
    } catch (error) {
      console.error("Error fetching most sold classes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMostSoldClasses();
  }, []);

  const barChartRef = useRef(null);

  // UseEffect para renderizar los gráficos
  useEffect(() => {
    // Destroy the previous chart instance if it exists
    if (barChartRef.current) {
      barChartRef.current.destroy();
    }

    // Render a new bar chart with the updated data
    if (mostSoldClasses && mostSoldClasses.length > 0) {
      const data = mostSoldClasses.map((clase) => ({
        name: clase.title,
        sales: clase.sales,
      }));

      barChartRef.current = new ChartJS(document.getElementById("bar-chart"), {
        type: "bar", // Change chart type to "bar"
        data: {
          labels: data.map((item) => item.name),
          datasets: [
            {
              label: "Sales",
              data: data.map((item) => item.sales),
              backgroundColor: "rgba(54, 162, 235, 0.6)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            x: {
              ticks: {
                beginAtZero: true,
              },
            },
            y: {
              ticks: {
                beginAtZero: true,
                stepSize: 1,
              },
            },
          },
        },
      });
    }
  }, [mostSoldClasses]);

  return (
    <Container className="courses-container" style={{ minHeight: "100vh", marginTop: "150px", padding: "20px" }}>
          <Container style={{marginBottom: '20px'}}>
        <Card className="courses-container bg-dark text-light courses-container">
          <h1 className="text-4xl font-bold mb-6" >Panel</h1>
        </Card>
        </Container>
      <Row className="justify-content-md-center" >
        <Card className="courses-container">
          <Card.Body>
            {mostSoldClasses && mostSoldClasses.length > 0 && (
              <Card.Title>Clases que mas venden</Card.Title>
            )}
            {mostSoldClasses && mostSoldClasses.length > 0 ? (
              <canvas id="bar-chart"></canvas>
            ) : (
              <div>
                <h1 className="text-center mb-5">Aun no has publicado alguna clase.</h1>
                <h2 className="text-center">
                  <Link to="/CrearClasses">Comienza ahora!</Link>
                </h2>
              </div>
            )}
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
};

export default Panel;
