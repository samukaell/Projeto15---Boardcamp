import { Router } from "express";
//controllers
import { getGames } from "../controllers/gamesControllers.js"


//Esnquentes -> poll
const gamesRouter = Router();

gamesRouter.get("/games", getGames);


export default gamesRouter;