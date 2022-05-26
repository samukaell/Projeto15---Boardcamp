import { Router } from "express";
//controllers
import { getCustomers } from "../controllers/customersControllers.js"


//Esnquentes -> poll
const customersRouter = Router();

customersRouter.get("/customers", getCustomers);


export default customersRouter;