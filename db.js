import pg from "pg";

const {Pool} = pg;
const db = new Pool({
  host: "localhost",
  port: 5432,
  user: "postgres",
  password: "sam123", // nao fica assim em um projeto de verdade
  database: "bordcamp"
});

export default db;