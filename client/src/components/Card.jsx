import React from "react";
import { useNavigate } from "react-router-dom";
import '../css/Card.css';
import "../App.css";

const Card = ({ car_id, car_name, base_price, total_price }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/cars/${car_id}`);
  };

  const handleEditDetails = () =>{
    navigate(`/edit/${car_id}`)
  }

  return (
    <div className="car-card">
      <h2>{car_name}</h2>
      <p><strong>Base Price:</strong> ${base_price}</p>
      <p><strong>Total Price:</strong> ${total_price}</p>

      <button className="details-btn" onClick={handleViewDetails}>
        View Details
      </button>
      <button className="details-btn" onClick={handleEditDetails}>
        Edit 
      </button>
    </div>
  );
};

export default Card;
