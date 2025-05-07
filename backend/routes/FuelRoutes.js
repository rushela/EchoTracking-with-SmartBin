import express from "express";
import { addFuel, deleteFuelRecord, getAllFuelRecords, updateFuelRecord } from "../controllers/FuelController.js";


const router = express.Router();

router.post("/add", addFuel);
router.get("/all", getAllFuelRecords);
router.put("/:vehicleId", updateFuelRecord);
//router.delete("/:vehicleId", deleteFuelRecord);
router.delete('/delete/:vehicleId', deleteFuelRecord);

export default router;
