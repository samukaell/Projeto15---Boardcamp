import db from "./../db.js";
import joi from "joi";

export async function getGames(req, res) {
    try {
        const result = await db.query("SELECT * FROM games");
        res.send(result.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter as receitas!");
    }
}

export async function postGames(req, res) {
    try {
        const userSchema = joi.object({
            name: joi.string().required(),
            image: joi.string().pattern(/^http/).required(),//FIXME -> uma atenticação que é uma url
            stockTotal: joi.number().integer().min(1).required(),
            categoryId: joi.number().integer().required(),
            pricePerDay: joi.number().integer().min(1).required(),
        });
        const {error} = userSchema.validate(req.body);
        if(error) return res.sendStatus(400);

        const { name,image,stockTotal,categoryId,pricePerDay } = req.body;

        //buscar se existe a categoria
        const categoria = await db.query(`SELECT * FROM categories WHERE id = $1`, [categoryId]);
        if(categoria.rows.length === 0) return res.sendStatus(400);//Não existe esta categoria
        
        //Buscar se ja existe um jogo com este nome
        const game = await db.query(`SELECT * FROM games WHERE name = $1`, [name]);
        if(game.rows.length > 0) return res.sendStatus(409);//Já existe um jogo com este nome

        //Inserir
        const result = await db.query(`
            INSERT INTO games (name,image,stockTotal,categoryId,pricePerDay)
            VALUES ($1,$2,$3,$4,$5);
            `, [name,image,stockTotal,categoryId,pricePerDay]);
            
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao tentar inserir uma nova categoria!");
    }
}