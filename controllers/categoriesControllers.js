import db from "./../db.js";
import joi from "joi";

export async function getCategories(req, res) {
    try {
        const result = await db.query("SELECT * FROM categories");
        res.send(result.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter as Categorias!");
    }
}
export async function postCategories(req, res) {
    try {
        const userSchema = joi.object({
            name: joi.string().required()
        });
        const {error} = userSchema.validate(req.body);
        if(error) return res.sendStatus(400);

        const { name } = req.body;

        //buscar se existe nome
        const categoria = await db.query(`SELECT * FROM categories WHERE name = $1`, [name]);
        if(categoria.rows.length > 0) return res.sendStatus(409);//Existe uma categoria com o mesmo nome
        //Inserir
        const result = await db.query(`
            INSERT INTO categories (name)
            VALUES ($1);
            `, [name]);
            
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao tentar inserir uma nova categoria!");
    }
}