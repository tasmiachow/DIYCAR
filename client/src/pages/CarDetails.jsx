import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
  }, [id]); // ✅ runs only when id changes (not on every re-render)

  if (!car) return <p>Loading...</p>;

  return (
    <div className="singleCar">
      <h2>{car.car_name}</h2>
      <p>Total Price: ${car.total_price}</p>
      {/* etc. */}
    </div>
  );
};

export default CarDetails;
