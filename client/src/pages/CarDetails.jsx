import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/CarDetails.css";

const CarDetails = () => {
  const { id } = useParams();
  const [car, setCar] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const res = await fetch(`http://localhost:3000/cars/${id}`);
        const data = await res.json();
        setCar(data);
      } catch (err) {
        console.error("❌ Failed to fetch car:", err);
      }
    };
    fetchCar();
  }, [id]);

  if (!car) return <p>Loading...</p>;

  return (
    <div className="singleCar">
      <h2>{car.car_name}</h2>
      <p><strong>Total Price:</strong> ${car.total_price}</p>

      <div className="feature-list">
        {car.features?.map((f, index) => (
          <div key={index} className="feature-item">
            <h3>{f.feature_name}</h3>
            <img src={f.image_url} alt={f.option_name} />
            <p>{f.option_name}</p>
            <p>+${f.option_price}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarDetails;
