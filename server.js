import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();

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

// TODO: Load users 
let currentUserId = 1;


// The dashboard
app.get("/", async (req, res) => {
  try {
    res.render("index.ejs", { data: "Dashboard" });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Receiving request to load all reports from this route then returning a JSON response
app.get("/load", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM reports");
    res.send({ data: result.rows });
  } catch (error) {
    res.send(error.message);
  }
});

app.get("/report", async (req, res) => {
  try {
    res.render("reports.ejs", { data: "Reporting" });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Creating Report Segment
app.post("/submit", async (req, res) => {
  try {
    const data = await req.body;
    const _status = "Pending"; 
    //TODO: Switch the status when the report will be approved
    const _user_id = currentUserId; 
    //TODO:Adding user roles in next update.

    await db.query(
      "INSERT INTO reports (report_title, event_type, details, event_date, event_time, status, user_id ) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [
        data.title,
        data.type,
        data.details,
        data.date,
        data.time,
        _status,
        _user_id,
      ]
    );
    console.log(
      `Successfully created the report \n Date: ${data.date} \n Title: ${data.title}\n Type: ${data.type}\n Details: ${data.details}`
    );
    res.redirect("/report");
  } catch (error) {
    res.status(404).send(error.message);
    console.log(error.message);
  }
});

app.post("/update", async (req, res) => {
  console.log("The input was received");
  try {
    const data = await req.body;
    console.log(`The update input was received with report id of: ${data.update_id}`)
    const result = await db.query(
      "UPDATE reports SET event_date=$1, event_time=$2, report_title=$3, event_type=$4, details=$5 WHERE reports.id=$6",
      [ data.date, 
        data.time, 
        data.title, 
        data.type, 
        data.details, 
        data.update_id
      ]);
      console.log(`{Sucessfully updated the report: ${data.delete_id} redirecting...`)
      res.redirect("/report")
    } catch (error) {
      res.status(404).send(error.message);
    }
  });
  
  app.post("/delete", async (req, res) => {
    try {
      const data = await req.body;
      console.log(`The delete input was received with report id of: ${data.delete_id}`)
      await db.query("DELETE FROM reports WHERE reports.id = $1", [data.delete_id])
      console.log(`{Sucessfully deleted the report: ${data.delete_id} redirecting...`)
      res.redirect("/report")
    } catch (error) {
      res.status(404).send(error.message);
    }
  })
  
app.listen(process.env.PORT_LOCAL, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT_LOCAL}`);
});

// async function getAllReports() {
//   try {
//     const result = await db.query("SELECT * FROM reports");
//     res.status(200).send({data: result.rows})
//   } catch (error) {
//     res.status(404).send(error.message)
//   }
// }

// app.post("/load/reports", async (res, req) => {
//   try {
//     const result = await db.query("SELECT * FROM reports");
//     res.status(200).send({data: result})
//   } catch (error) {
//     res.status(404).send(error.message)
//   }
// });

  // app.post("/update", async(req,res)=> {
    //   try {
      //     console.log("I was here at update POST")
      // const report = result.rows;
      // res.status(200).send({ message: "OK" });
//   } catch(error) {
//     res.status(404).send(error.message)
//   }

// });