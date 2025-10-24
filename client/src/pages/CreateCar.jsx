import React, { useState, useEffect } from "react";
import "../css/CreateCar.css";
import "../App.css";

const CreateCar = () => {
  const [car, setCar] = useState({
    car_name: "",
    color: "",
    interior: "",
    wheels: "",
    carSize: "",
    totalPrice: 0,
  });

  const [features, setFeatures] = useState([]);
  const [options, setOptions] = useState([]);
  const basePrice = 25000;

  // --- Fetch feature & option data dynamically ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featRes, optRes] = await Promise.all([
          fetch("http://localhost:3000/cars/features"),
          fetch("http://localhost:3000/cars/options"),
        ]);
        const featuresData = await featRes.json();
        const optionsData = await optRes.json();
        setFeatures(featuresData);
        setOptions(optionsData);
      } catch (err) {
        console.error("❌ Failed to fetch features/options:", err);
      }
    };
    fetchData();
  }, []);

  // --- Compute dynamic prices from DB options (optional fallback) ---
  const priceMap = {
    color: { Red: 500, Blue: 400, Black: 600, White: 300 },
    interior: { Leather: 1500, Fabric: 800, Suede: 1200 },
    wheels: { Standard: 0, Alloy: 1000, Sports: 1800 },
    carSize: { Compact: 0, Sedan: 2000, SUV: 4000 },
  };

  // --- Feature / option ID mapping for POST payload ---
  const featureMap = { color: 1, interior: 2, wheels: 3, carSize: 4 };

  const optionMap = {
    Red: 1, Blue: 2, Black: 3, White: 4,
    Leather: 5, Fabric: 6, Suede: 7,
    Standard: 8, Alloy: 9, Sports: 10,
    Compact: 11, Sedan: 12, SUV: 13
  };

  // --- Handle feature selection + price updates ---
  const handleChange = (feature, option) => {
    const updatedCar = { ...car, [feature]: option };

    // --- incompatibility rules ---
    if (feature === "wheels" && option === "Sports" && car.carSize === "Compact") {
      alert("❌ Sports wheels are not compatible with Compact cars!");
      return;
    }
    if (feature === "carSize" && option === "Compact" && car.wheels === "Sports") {
      alert("❌ Sports wheels are not compatible with Compact cars!");
      return;
    }

    // --- Recalculate total price ---
    let newTotal = basePrice;
    Object.entries(priceMap).forEach(([feat, opts]) => {
      const selected = feat === feature ? option : updatedCar[feat];
      if (selected && opts[selected]) newTotal += opts[selected];
    });

    updatedCar.totalPrice = newTotal;
    setCar(updatedCar);
  };

  // --- Handle POST to backend ---
  const handleSubmit = async () => {
    const customizations = Object.entries(car)
      .filter(([key]) => ["color", "interior", "wheels", "carSize"].includes(key))
      .map(([feature, option]) => ({
        feature_id: featureMap[feature],
        option_id: optionMap[option],
      }));

    const payload = {
      car_name: car.car_name || "My Custom Bolt",
      base_price: basePrice,
      total_price: car.totalPrice,
      customizations,
    };

    try {
      const res = await fetch("http://localhost:3000/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      console.log("✅ Car created:", data);
      alert(`✅ Car "${payload.car_name}" saved successfully!`);
    } catch (err) {
      console.error("❌ Error saving car:", err);
      alert("Failed to save car. Please try again.");
    }
  };

  return (
    <div className="create-car">
      <h1>Customize Your Car</h1>

      {/* --- Car Name --- */}
      <div className="input-group">
        <label>Car Name</label>
        <input
          type="text"
          placeholder="Enter your car name..."
          value={car.car_name}
          onChange={(e) => setCar({ ...car, car_name: e.target.value })}
        />
      </div>

      {/* --- Feature Blocks --- */}
      {Object.keys(priceMap).map((featureKey) => (
        <div className="feature" key={featureKey}>
          <h3>{featureKey.charAt(0).toUpperCase() + featureKey.slice(1)}</h3>
          <div className="option-grid">
            {Object.entries(priceMap[featureKey]).map(([option, price]) => {
              const image = options.find(
                (opt) => opt.name === option
              )?.image_url;
              return (
                <button
                  key={option}
                  onClick={() => handleChange(featureKey, option)}
                  className={`option-btn ${car[featureKey] === option ? "active" : ""}`}
                >
                  {image && <img src={image} alt={option} />}
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* --- Summary --- */}
      <div className="summary">
        <h2>Total Price: ${car.totalPrice.toLocaleString()}</h2>
        <p>
          <strong>Selected:</strong>{" "}
          {`${car.color || "-"} | ${car.interior || "-"} | ${car.wheels || "-"} | ${
            car.carSize || "-"
          }`}
        </p>
      </div>

      <button className="save-btn" onClick={handleSubmit}>
        Save Car
      </button>
    </div>
  );
};

export default CreateCar;
