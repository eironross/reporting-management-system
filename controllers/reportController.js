import pg from "pg";
import fs from "fs";
import path from "path";
import { create_pdf } from "../createPDF.js";

 
let currentUserId = 1;

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.NAME,
  password: process.env.ACCESS,
  port: process.env.PORT,
});
db.connect();

export const get_all_reports = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM reports");
    // console.log(result);
    res.send({ data: result.rows });
  } catch (error) {
    res.send(error.message);
  }
};

export const home_report = (req, res) => {
  try {
    res.render("reports.ejs", { data: "Reporting" });
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const create_report = async (req, res) => {
  try {
    const data = await req.body;
    console.log(data)
    const date = new Date()
    const dateToday = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                          .toISOString()
                          .split("T")[0];
    const dataList = {
      title: data.title,
      type: data.type,
      details: data.details,
      date: data.date,
      time: data.time,
      _status: "Pending",
      _user_id: currentUserId,
      today: dateToday,
      report_id: 100,
    };

    console.log(dataList);
    // Object are not iterable. You can't apply spread operator for obj.

    // const _status = "Pending";
    // //TODO: Switch the status when the report will be approved
    // const _user_id = currentUserId;
    // //TODO:Adding user roles in next update.

    // Create PDF File
    await create_pdf(dataList).catch((error) => console.error("Error", error));

    console.log("Outside the function")
    // The function to create binary data
    const buf = fs.readFileSync(`./tmp/${dataList.title}_${dataList.date}.pdf`);
    const file = new Buffer.from(buf)
    console.log("Sucessfully converted the pdf to base64String", file);

    await db.query(
      "INSERT INTO reports (report_title, event_type, details, event_date, event_time, status, user_id, file_pdf ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [ dataList.title, dataList.type, dataList.details, dataList.date, dataList.time, dataList._status, dataList._user_id
        , file]
    );

    console.log(
      `Successfully created the report \n Date: ${dataList.date} \n Title: ${dataList.title}\n Type: ${dataList.type}\n Details: ${dataList.details}\n`
    );

    // Delete the the pdf
    fs.unlinkSync(`./tmp/${dataList.title}_${dataList.date}.pdf`, (error) => {
      console.error("Error:", error);
    });

    res.redirect("/report");

  } catch (error) {
    res.status(404).send(error.message);
    console.log(error.message);
  }
};

export const update_report = async (req, res) => {
  console.log("The input was received");
  try {
    const data = await req.body;
    console.log(
      `The update input was received with report id of: ${data.update_id}`
    );
    await db.query(
      "UPDATE reports SET event_date=$1, event_time=$2, report_title=$3, event_type=$4, details=$5 WHERE reports.id=$6",
      [
        data.date,
        data.time,
        data.title,
        data.type,
        data.details,
        data.update_id,
      ]
    );
    console.log(
      `Sucessfully updated the report: ${data.update_id} redirecting...`
    );
    res.redirect("/report");
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const delete_report = async (req, res) => {
  try {
    const data = await req.body;

    console.log(
      `The delete input was received with report id of: ${data.delete_id}`
    );

    await db.query("DELETE FROM reports WHERE reports.id = $1", [
      data.delete_id,
    ]);
    console.log(
      `Sucessfully deleted the report: ${data.delete_id} redirecting...`
    );

    res.redirect("/report");
  } catch (error) {
    res.status(404).send(error.message);
  }
};

export const download_file = async(req, res) => {
  try {
    
    const report_id = req.body.download_id
    const result = await db.query("SELECT * FROM reports WHERE id = $1", [report_id])
    const { file_pdf, event_date, report_title } = result.rows[0]
    const date = new Date(event_date);
    const dateString = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                  .toISOString()
                  .split("T")[0];
    const path = `./tmp/${report_title}_${dateString}.pdf`
    if (!file_pdf) {
      return res.send("File doesn't exist on the database")
    }

    console.log(file_pdf)
    fs.writeFileSync(path, file_pdf, "base64", (error)=> {
      console.error("Error:", error)
    })

    console.log(`Download is process with id of ${report_id}`)
     
    
    res.set({
      Location: "/report"
    })
    res.download(path)


  } catch(error) {
    console.log("Error")
    res.status(404).send(error.message);
  }
}
