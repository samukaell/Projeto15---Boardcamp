import { Router } from "express";
//controllers
import { getCustomers,postCustomers,getCustomersId,putCustomers } from "../controllers/customersControllers.js"

//Middlewares
import {validationCustomers} from "../middlewares/validacaoCustomers.js"
//Esnquentes -> poll
const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.post("/customers",validationCustomers, postCustomers);
customersRouter.get("/customers/:id", getCustomersId);
customersRouter.put("/customers/:id",validationCustomers, putCustomers);

export default customersRouter;