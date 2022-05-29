import express, { json } from "express";
import dotenv from "dotenv";
import chalk from 'chalk';
import cors from "cors";

//Routers
import categoriesRouters from "./routers/categoriesRouters.js"
import customersRouters from "./routers/customersRouters.js"
import gamesRouters from "./routers/gamesRouters.js"
import rentalsRouters from "./routers/rentalsRouters.js"


//Configurações padrões
const app = express();
app.use(json());
app.use(cors());
dotenv.config();
//
//Routers
app.use(categoriesRouters);
app.use(customersRouters);
app.use(gamesRouters);
app.use(rentalsRouters);


const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(chalk.green.bold(`O servidor está em pé ${port}`));
});