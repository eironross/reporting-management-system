import express from "express";
import {
    get_all_reports,
    create_report,
    update_report,
    delete_report,
    home_report,
    download_file,
  } from  "../controllers/reportController.js"
const router = express.Router();

// TODO: Do you need to db.end() whenever a query is fulfilled?

// TODO: Load users

// Receiving request to load all reports from this route then returning a JSON response
router.get("/load", get_all_reports);
  
router.get("/", home_report );
// Creating Report Segment
router.post("/submit", create_report );

router.post("/update", update_report );

router.post("/delete", delete_report);

router.post("/download", download_file)

export default router;
