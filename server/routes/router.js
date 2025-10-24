//{ getCars, getCarById, addCar, editCar, deleteCar }
import express from "express";
import CarsController from "../controllers/cars.js";
import pool from "../config/database.js";

const router = express.Router();



//for frontend add cars 
router.get("/features", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM features;");
  res.json(rows);
});

router.get("/options", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM options;");
  res.json(rows);
});

router.get("/", CarsController.getCars);

router.get("/:car_id", CarsController.getCarById);
router.post("/", CarsController.addCar);
router.delete("/:car_id", CarsController.deleteCar);
router.patch("/:car_id", CarsController.editCar);




export default router;

