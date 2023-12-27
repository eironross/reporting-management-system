import pg from "pg";
import fs from "fs";
import { create_pdf } from "./createPDF.js";

let currentUserId = 1;

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.NAME,
  password: process.env.ACCESS,
  port: process.env.PORT,
});
db.connect();

const dateFormatted = () => {
  const date = new Date();
  const dateToday = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];
  return dateToday;
}

export const get_all_reports = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM reports");
    res.send({ data: result.rows });
  } catch (error) {
    res.status(404).send(error.message);
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
    const dateToday = dateFormatted();

    const result = await db.query("SELECT id FROM reports ORDER BY id DESC LIMIT(1)")
    const new_report_id = result.rows[0].id + 1;
    
    // TODO: The problem might occur with the numbering if the latest report might be deleted. 


    const dataList = {
      title: data.title,
      type: data.type,
      details: data.details,
      date: data.date,
      time: data.time,
      status: "Pending",
      user_id: currentUserId,
      today: dateToday,
      report_id: new_report_id,
    };

    console.log(dataList+"\n");
    // Object are not iterable. You can't apply spread operator for obj.


    // Create PDF File
    await create_pdf(dataList).catch((error) => console.error("Error", error));

    console.log("Outside the function");

    // The function to create binary data
    const buf = fs.readFileSync(`./tmp/${dataList.title}_${dataList.date}.pdf`);
    const file = new Buffer.from(buf);

    console.log("Sucessfully converted the pdf to base64String", file);

    await db.query(
      "INSERT INTO reports (report_title, event_type, details, event_date, event_time, status, user_id, file_pdf ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)",
      [
        dataList.title,
        dataList.type,
        dataList.details,
        dataList.date,
        dataList.time,
        dataList.status,
        dataList.user_id,
        file,
      ]
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
  try {
    const data = await req.body;
    console.log(
      `The update input was received with report id of: ${data.update_id}`
    );

    const date = new Date();
    const dateString = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];


    const dataList = {
      title: data.title,
      type: data.type,
      details: data.details,
      date: data.date,
      time: data.time,
      status: "Pending",
      user_id: currentUserId,
      today: dateString,
      report_id: data.update_id,
    };

    console.log(dataList);

    // Create PDF File
    await create_pdf(dataList).catch((error) => console.error("Error", error));

    const buf = fs.readFileSync(`./tmp/${dataList.title}_${dataList.date}.pdf`);
    const file = new Buffer.from(buf);

    await db.query(
      "UPDATE reports SET event_date=$1, event_time=$2, report_title=$3, event_type=$4, details=$5, file_pdf=$6 WHERE reports.id=$7",
      [
        dataList.date,
        dataList.time,
        dataList.title,
        dataList.type,
        dataList.details,
        file,
        dataList.report_id,
      ]
    );
    console.log(
      `Sucessfully updated the report: ${data.update_id} redirecting...`
    );

    // Delete the the pdf
    fs.unlinkSync(`./tmp/${dataList.title}_${dataList.date}.pdf`, (error) => {
      console.error("Error:", error);
    });

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

export const download_file = async (req, res) => {
  try {
    const report_id = req.params.id;
    const result = await db.query("SELECT * FROM reports WHERE id = $1", [
      report_id,
    ]);

    const { file_pdf, event_date, report_title } = result.rows[0];
    const date = new Date(event_date);
    const dateString = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .split("T")[0];

    const path = `./tmp/${report_title}_${dateString}.pdf`;

    if (!file_pdf) {
      return res.send("File doesn't exist on the database");
    }

    console.log(file_pdf);

    fs.writeFileSync(path, file_pdf, "base64", (error) => {
      console.error("Error:", error);
    });

    console.log(`Download is process with id of ${report_id}`);

    // TODO: Problem when downloading file and removing the file from the tmp. Not able to redirect when download
    // Resolved for the tmp. Added a callback function on the res.download to unlink data from tmp after downloading
    res.download(path, (error) => {
      if (error) {
        console.error("Error:", error);
      } else {
        fs.unlinkSync(path, (error) => {
          console.error("Error:", error);
        });
      }
    });
  
  } catch (error) {
    console.log("Error in the Server side", error);
    res.status(404).send(error.message);
  }
};
