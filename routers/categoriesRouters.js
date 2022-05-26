import { Router } from "express";
//controllers
import { getCategories } from "../controllers/categoriesControllers.js"


//Esnquentes -> poll
const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);


export default categoriesRouter;