import { Router } from "express";
//controllers
import { getRentals } from "../controllers/rentalsControllers.js"


//Esnquentes -> poll
const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);


export default rentalsRouter;