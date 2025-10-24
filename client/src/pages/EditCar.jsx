import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../css/EditCar.css";

const EditCar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [car, setCar] = useState(null);
  const [features, setFeatures] = useState([]);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState({});

  // 🧠 Fetch car, features, and options
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carRes, featRes, optRes] = await Promise.all([
          fetch(`http://localhost:3000/cars/${id}`),
          fetch("http://localhost:3000/cars/features"),
          fetch("http://localhost:3000/cars/options"),
        ]);

        const carData = await carRes.json();
        const featuresData = await featRes.json();
        const optionsData = await optRes.json();

        setCar(carData);
        setFeatures(featuresData);
        setOptions(optionsData);

        // Pre-fill selected options
        const initialSelections = {};
        carData.features.forEach((f) => {
          initialSelections[f.feature_name] = f.option_name;
        });
        setSelectedOptions(initialSelections);
      } catch (err) {
        console.error("❌ Failed to fetch data:", err);
      }
    };
    fetchData();
  }, [id]);

  // 🎯 Handle dropdown changes
  const handleChange = (featureName, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [featureName]: value,
    }));
  };

  // ✅ Update car
  const handleUpdate = async () => {
    try {
      const customizations = features.map((f) => {
        const option = options.find(
          (o) =>
            o.name === selectedOptions[f.name] &&
            o.option_for_feature === f.feature_id
        );
        return {
          feature_id: f.feature_id,
          option_id: option ? option.option_id : null,
        };
      });

      const payload = {
        car_name: car.car_name,
        base_price: car.base_price,
        total_price: car.total_price,
        customizations,
      };

      const res = await fetch(`http://localhost:3000/cars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Update failed");
      alert("✅ Car updated successfully!");
      navigate("/customcars");
    } catch (err) {
      console.error("❌ Error updating car:", err);
      alert("Update failed!");
    }
  };

  // 🗑️ Delete car
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this car?")) return;
    try {
      await fetch(`http://localhost:3000/cars/${id}`, { method: "DELETE" });
      alert("🗑️ Car deleted successfully!");
      navigate("/customcars");
    } catch (err) {
      console.error("❌ Error deleting car:", err);
    }
  };

  if (!car) return <p>Loading car details...</p>;

  return (
    <div className="edit-container">
      <h1>Edit Your Car</h1>
      <h2>{car.car_name}</h2>
      <p>
        <strong>Total Price:</strong> ${car.total_price}
      </p>

      <div className="feature-edit-section">
        {features.map((feature) => (
          <div key={feature.feature_id} className="feature-dropdown">
            <label>{feature.name}</label>
            <select
              value={selectedOptions[feature.name] || ""}
              onChange={(e) => handleChange(feature.name, e.target.value)}
            >
              <option value="">Select an option</option>
              {options
                .filter((opt) => opt.option_for_feature === feature.feature_id)
                .map((opt) => (
                  <option key={opt.option_id} value={opt.name}>
                    {opt.name} (+${opt.price})
                  </option>
                ))}
            </select>
          </div>
        ))}
      </div>

      <div className="edit-btn-container">
        <button onClick={handleUpdate} className="details-btn">
          💾 Save Changes
        </button>
        <button onClick={handleDelete} className="details-btn delete">
          🗑️ Delete Car
        </button>
      </div>
    </div>
  );
};

export default EditCar;
