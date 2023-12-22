import pg from "pg";
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

//

