import db from "./../db.js";
import joi from "joi";
import dayjs from "dayjs";

export async function validationCustomers(req, res, next) {
    try {
        const userSchema = joi.object({
            name: joi.string().required(),
            phone: joi.string().pattern(/^[0-9]{11}$/).required(),
            cpf: joi.string().pattern(/^[0-9]{11}$/).required(),
            birthday: joi.string().pattern(/^[1-2][0-9]{3}-[0-9]{2}-[0-9]{2}$/).required(),
        });
        const {error} = userSchema.validate(req.body);
        if(error) return res.sendStatus(400);

        const { birthday, cpf } = req.body;

        //validar se a data de aniversario e valida
        const hoje = dayjs().format('YYYY-MM-DD');
        if(Date.parse(hoje)<=Date.parse(birthday)){
            return res.sendStatus(400);//Ainda nao chegou a data
        }
        //FIXME -> se no post e no Put nao poder haver cpf igual retorna esta funcionalidade
        /*
        //buscar se existe um cpf igual cadastrado
        const customer = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);
        if(customer.rows.length > 0) return res.sendStatus(409);//CPF ja cadastrado
        */

        next();
    }catch(error) {
        res.status(500).send("Error na validação do usuario");
    }
}