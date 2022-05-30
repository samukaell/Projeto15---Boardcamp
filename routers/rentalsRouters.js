import { Router } from "express";
//controllers
import { getRentals,postRentals,postRentalsFinal } from "../controllers/rentalsControllers.js"


//Esnquentes -> poll
const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", postRentals);
rentalsRouter.post("/rentals/:id/return", postRentalsFinal);

export default rentalsRouter;