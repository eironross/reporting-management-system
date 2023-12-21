import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const PORT = 5000;

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.NAME,
  password: process.env.ACCESS,
  port: process.env.PORT,
});
db.connect(); 
// TODO: Do you need to db.end() whenever a query is fulfilled?

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let currentUserId = 1;

async function getAllReports() {
  try {
    const result = await db.query("SELECT * FROM reports");
    console.log(result)
    res.status(200).send({data: result})
  } catch (error) {
    res.status(404).send(error.message)
  }
}



app.get("/", async (req, res) => {
  try {
    res.render("test.ejs");
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/load", async (req, res ) => {
    try {
      const result = await db.query("SELECT * FROM reports");
      res.send({data: result.rows})
    } catch (error) {
      res.send(error.message)
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
