import db from "./../db.js";
import joi from "joi";
import dayjs from "dayjs";

export async function getRentals(req, res) {
    try {
        const {customerId,gameId} = req.query;

        if(customerId != undefined && gameId != undefined){
            //customerId e gameId
            const result = await db.query(
                `SELECT * FROM rentals 
                JOIN customers 
                ON customerId = customers.id
                JOIN games
                ON gameid = games.id
                WHERE customerId = $1 AND gameid  = $2
                `,[customerId,gameId]);
          
            return res.send(result.rows);

        }else if(customerId == undefined && gameId != undefined){
            //gameID
            const result = await db.query(
                `SELECT * FROM rentals 
                JOIN customers 
                ON customerId = customers.id
                JOIN games
                ON gameid = games.id
                WHERE gameid = $1
                `,[gameId]);
          
            return res.send(result.rows);

        }else if(gameId == undefined && customerId != undefined){
            //customerId
            const result = await db.query(
                `SELECT * FROM rentals 
                JOIN customers 
                ON customerId = customers.id
                JOIN games
                ON gameid = games.id
                WHERE customerId = $1
                `,[customerId]);
          
            return res.send(result.rows);

        }else{
            //ambos undefined
            const result = await db.query(
                `SELECT * FROM rentals 
                JOIN customers 
                ON customerId = customers.id
                JOIN games
                ON gameid = games.id
                `);
          
            return res.send(result.rows);
        }


    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao obter os rentals!");
    }
}

export async function postRentals(req, res) {
    try {

        const userSchema = joi.object({
            customerId: joi.number().required(),
            gameId: joi.number().required(),
            daysRented: joi.number().integer().min(1).required()
        });
        const {error} = userSchema.validate(req.body);
        if(error) return res.sendStatus(400);


        const { customerId,gameId,daysRented } = req.body;
        
        const hoje = dayjs().format('YYYY-MM-DD');
        
        //buscar o customer
        const customer = await db.query(`SELECT * FROM customers WHERE id = $1`, [customerId]);
        if(customer.rows.length === 0) return res.sendStatus(400);//Customer não existe
        //buscar o game
        const game = await db.query(`SELECT * FROM games WHERE id = $1`, [gameId]);
        if(game.rows.length === 0) return res.sendStatus(400);//Game não existe

        let originalPrice = game.pricePerDay*daysRented;        

        //Inserindo
        const result = await db.query(`
            INSERT INTO rentals (customerId,gameId,rentDate,daysRented,returnDate,originalPrice,delayFee)
            VALUES ($1,$2,$3,$4,$5,$6,$7);
            `, [customerId,gameId,hoje,daysRented,null,originalPrice,null]);
            
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao tentar inserir um rentals!");
    }
}

export async function postRentalsFinal(req, res) {
    const {id} = req.params;
    try {
        //Buscar se existe o rental
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if(rental.rows.length===0){
            return res.sendStatus(404);  
        } 
        //verificar se ja não esta finalizado
        if(rental.rows[0].returndate !== null) {
            return res.sendStatus(400);//Ja esta finalizado
        }

        //Verificar atraso
        //Dia do aluguel + quantidade de dias alugados
        let prazo = dayjs().add(rental.rows[0].daysRented, 'day').format(`YYYY-MM-DD`);
        let delayFee = 0;
        const hoje = dayjs().format('YYYY-MM-DD');
        if(Date.parse(hoje)>Date.parse(prazo)){
            //Esta atrasado
            const date1 = prazo
            let dif = date1.diff(hoje, 'day');
            delayFee = dif*rental.rows[0].originalprice;
        }

        //Atualizando
        const update = await db.query(`
            UPDATE rentals 
            SET
                returnDate = $1,
                delayFee = $2
            WHERE id = $3`, [hoje,delayFee,id]);

        res.sendStatus(200);

    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao tentar inserir um rentals!");
    }
}

export async function deleteRentals(req, res) {
    const {id} = req.params;
    try {
        //Buscar se existe o rental
        const rental = await db.query(`SELECT * FROM rentals WHERE id = $1`, [id]);
        if(rental.rows.length===0){
            return res.sendStatus(404); //Não existe este rentals
        } 
        //verificar se ja não esta finalizado
        if(rental.rows[0].returndate !== null) {
            return res.sendStatus(400);//Ja esta finalizado
        }
        
        const result = await db.query(`
        DELETE FROM rentals WHERE id = $1
        `, [id]);

        res.sendStatus(200);

    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao tentar inserir um rentals!");
    }
}
