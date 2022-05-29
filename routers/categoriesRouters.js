import { Router } from "express";
//controllers
import { getCategories, postCategories } from "../controllers/categoriesControllers.js"


//Esnquentes -> poll
const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", postCategories);

export default categoriesRouter;