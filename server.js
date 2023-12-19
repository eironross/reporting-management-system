import 'dotenv/config'
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const PORT = 8000;

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.NAME,
  password: process.env.ACCESS,
  port: process.env.PORT,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


let currentUserId = 1;

async function getAllReports() {
  try {
    const result = await db.query("SELECT * FROM reports");
    return result.rows;
  } catch (error) {
    res.status(404).send(error.message)
  }
}

app.get("/", async (req, res) => {
  try {
    res.render("index.ejs", { data: "Dashboard" });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

app.get("/report", async (req, res) => {
  try {
    const reports = await getAllReports();
    res.render("reports.ejs", { data: "Reporting", reports: reports });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Creating Report Segment

app.post("/submit", async (req, res) => {
  try {
    const data = await req.body
    const _status = "Pending";
    const _user_id = currentUserId;

    await db.query("INSERT INTO reports (report_title, event_type, details, event_date, event_time, status, user_id ) VALUES ($1, $2, $3, $4, $5, $6, $7)", [data.title, data.title, data.details, data.date, data.time, _status, _user_id ])
    console.log(
      `Successfully created the report \n Date: ${data.date} \n Title: ${data.title}\n Type: ${data.type}\n Details: ${data.details}`
    );
    res.redirect("/report");
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error.message)
  }
});

app.post("/update/:id", async (req, res) => {
  console.log("The input was received")
  try {
    const id = req.params.id
    console.log(id)
    const result = await db.query("SELECT * FROM reports WHERE id = $1", [id]);
    const report = result.rows;
    // res.redirect('/report')
  } catch(error) {
    res.status(404).send(error.message)
  }
});

// app.post("/update", async(req,res)=> {
//   try {
//     console.log("I was here at update POST")
//   } catch(error) {
//     res.status(404).send(error.message)
//   }

// });


app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
