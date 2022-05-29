import { Router } from "express";
//controllers
import { getGames,postGames } from "../controllers/gamesControllers.js"


//Esnquentes -> poll
const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", postGames);

export default gamesRouter;