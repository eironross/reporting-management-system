import pg from "pg";
import fs from "fs";
import { create_pdf } from "./createPDF.js";
import { ReportModel } from "../models/reportModel.js";


// Server to API 02/25/2024

const currentUserId = 1;

// TODO: Read the sequelize docs
// Connecting to the PG Server
const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.NAME,
  password: process.env.ACCESS,
  port: process.env.PORT,
});

db.connect();

// Loading all reports
export const get_all_reports = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM reports");
    res.send({ data: result.rows });
  } catch (error) {
    res.status(404).send(error.message);
  }
};

// Render Home Page
export const home_report = (req, res) => {
  try {

    res.render("reports.ejs", { data: "Reporting" });

  } catch (error) {

    res.status(404).send(error.message);

    console.log("Error:", error)
  }
};


// CREATE: Report generation
export const create_report = async (req, res) => {
  try {
    const data = await req.body;

    const result = await db.query("SELECT id FROM reports ORDER BY id DESC LIMIT(1)")

    const new_report_id = result.rows[0].id + 1;
    
    // TODO: The problem might occur with the numbering if the latest report might be deleted. 
    // if status is empty status will be default to Pending status 
    // note that the req.body has the same name for the properties on the class model
    // ...data copying the object then modifying the user_id, currentUserId, today properties
    const dataList = new ReportModel({...data, user_id: currentUserId, report_id: new_report_id})
    
    const { title, type, details, date, time, status, user_id } = dataList

    console.table(dataList);
    // Object are not iterable.

    // Create PDF File
    await create_pdf(dataList).catch((error) => console.log("Error", error));

    const path = `./tmp/${title}_${date.split("-").join("")}.pdf`
    // The function to create binary data
    const buf = fs.readFileSync(path);

    const file = new Buffer.from(buf, "utf8").toString('base64');

    // Delete the pdf
    fs.unlinkSync(path, (error) => console.log("Error:", error));

    const query =  {
      text: `INSERT INTO 
            reports (report_title, event_type, details, event_date, event_time, status, user_id, file_pdf ) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      values: [title, type, details, date, time, status, user_id, file]
    }

    // Inserting the data to the Database using the parameterized query
    await db.query(query);

    // const dataList = {
    //   title: data.title,
    //   type: data.type,
    //   details: data.details,
    //   date: data.date,
    //   time: data.time,
    //   status: "Pending",
    //   user_id: currentUserId,
    //   today: dateToday,
    //   report_id: new_report_id,
    // };

    res.redirect("/report");

  } catch (error) {

    res.status(404).send(error.message);

    console.log("Error:", error.message)
  }
};

// UPDATE: Editing reports on this segment
export const update_report = async (req, res) => {
  try {

    const data = await req.body;

    const dataList = new ReportModel({...data, user_id: currentUserId, report_id: data.update_id })
    
    const { title, type, details, date, time, report_id } = dataList
    
    console.log(`The update input was received with report id of:`, report_id);

    console.table(dataList);

    // Create PDF File
    await create_pdf(dataList).catch((error) => console.log("Error", error));
    
    const path = `./tmp/${title}_${date.split("-").join("")}.pdf`

    const buf = fs.readFileSync(path);

    const file = new Buffer.from(buf, "utf8").toString('base64');
    // Delete the the pdf
    fs.unlinkSync(path, (error) => console.log("Error:", error));

    //report_title, event_type, details, event_date, event_time, status, user_id, file_pdf
    const query = {
      text: `UPDATE reports 
             SET report_title=$1, event_type=$2, details=$3, event_date=$4, event_time=$5, file_pdf=$6 
             WHERE reports.id=$7`,

      values: [title, type, details, date, time, file, report_id]
    }
    await db.query(query);

    console.log(`Sucessfully updated the report: ${report_id} redirecting...`);

    res.redirect("/report");

  } catch (error) {

    res.status(404).send(error.message);

    console.log("Error:", error.message)

  }
};

// DELETE: Delete reports based from the req
export const delete_report = async (req, res) => {
  try {
    const { delete_id } = await req.body;

    console.warn(
      `The delete input was received with report id of: `
    , delete_id);

    await db.query("DELETE FROM reports WHERE reports.id = $1", [
      delete_id
    ]);

    console.log(
      `Sucessfully deleted the report: ${delete_id} redirecting...`
    );

    res.redirect("/report");

  } catch (error) {

    res.status(404).send(error.message);

    console.log("Error:", error.message)
  }
};

//DOWNLOAD: Downloading file
// TODO: Send the binary data from the server then create the file from the client side
export const download_file = async (req, res) => {
  try {

    const report_id = req.params.id;

    const result = await db.query("SELECT * FROM reports WHERE id = $1", [
      report_id,
    ]);

    const { file_pdf, event_date, report_title } = result.rows[0];

    // Checking if the file_pdf exist on the Database
    if (!file_pdf) return res.status(404).send({message: file_pdf});
    
    const date = new Date(event_date);
    const dateString = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
    
    
    console.log(file_pdf)
    // const path = `./tmp/${report_title}_${dateString}.pdf`;


    const plain = new Buffer.from(file_pdf, "base64").toString("utf8")
    console.log(`Download is process with id of: `, report_id);

    res.status(200).send({report: {
      data: plain,
      title: report_title,
      date: dateString

    }});
  
  } catch (error) {

    res.status(404).send(error.message);

    console.log("Error:", error.message);
  }
};
