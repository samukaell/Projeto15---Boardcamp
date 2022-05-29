import db from "./../db.js";


export async function getCustomers(req, res) {
    try {
        const result = await db.query("SELECT * FROM customers");
        res.send(result.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao buscar os clientes!");
    }
}

export async function getCustomersId(req, res) {
    const {id} = req.params;

    try {
        const result = await db.query(`SELECT * FROM customers WHERE id = $1`, [id]);
        if(result.rows.length === 0) return res.sendStatus(404);

        res.send(result.rows);
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao buscar os clientes!");
    }
}

export async function postCustomers(req, res) {
    try {
        const { name,phone,cpf,birthday } = req.body;
        
        //buscar se existe um cpf igual cadastrado
        const customer = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);
        if(customer.rows.length > 0) return res.sendStatus(409);//CPF ja cadastrado

        //Inserindo
        const result = await db.query(`
            INSERT INTO customers (name,phone,cpf,birthday)
            VALUES ($1,$2,$3,$4);
            `, [name,phone,cpf,birthday]);
            
        res.sendStatus(201);
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao tentar inserir um novo cliente!");
    }
}


export async function putCustomers(req, res) {
    const {id} = req.params;

    try {
        const { name,phone,cpf,birthday } = req.body;

        //buscar se existe um cpf igual cadastrado
        const customer = await db.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);
        if(customer.rows.length > 1) return res.sendStatus(409);//Pode haver ao menos 1 cpf

        //Atualizando
        const update = await db.query(`
            UPDATE customers 
            SET
                name = $1,
                phone = $2,
                cpf = $3,
                birthday = $4
            WHERE id = $5`, [name,phone,cpf,birthday,id]);

        res.sendStatus(200);
    } catch (e) {
        console.log(e);
        res.status(500).send("Ocorreu um erro ao tentar atualizar o cliente!");
    }
}