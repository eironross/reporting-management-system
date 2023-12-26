import "dotenv/config";
import fs from "fs";
import path from "path";
import puppeteer from "puppeteer";
import handlebars from "handlebars";
import pg from "pg";
import { error } from "console";


const db = new pg.Client({
    user: process.env.USER,
    host: process.env.HOST,
    database: process.env.NAME,
    password: process.env.ACCESS,
    port: process.env.PORT,
  });
  db.connect();

  const date = new Date()
  const dateToday = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
                          .toISOString()
                          .split("T")[0];
  
  const data = {
      id: 28,
      dateToday: dateToday,
      title: "Event Report Force Outage",
      date: "05/12/2018",
      time: "11:00",
      details: "Graduated in 2014 by Federal University of Lavras, work with Full-Stack development and E-commerce."
  }
  
async function createPDF(data){

	var templateHtml = fs.readFileSync(path.join(process.cwd(), 'template.html'), 'utf8');
	var template = handlebars.compile(templateHtml);
	var html = template(data);

	var pdfPath = path.join('tmp', `Event-Report.pdf`);

	var options = {
		format: 'A4',
		headerTemplate: "<p></p>",
		footerTemplate: "<p></p>",
		displayHeaderFooter: true,
		margin: {
			top: "10px",
			bottom: "30px"
		},
		printBackground: true,
		path: pdfPath
	}

	const browser = await puppeteer.launch({
		args: ['--no-sandbox']
	});

	var page = await browser.newPage();
	
	await page.goto(`data:text/html;charset=UTF-8,${html}`, {
		waitUntil: 'networkidle0'
	});
    console.log("Success")
	await page.pdf(options);
	await browser.close();


    // The function to create binary data
    const bitmap = fs.readFileSync("./tmp/Event-Report.pdf")
    const buffer1 = new Buffer.from(bitmap)
    console.log(buffer1)
    
    await db.query("INSERT INTO files (file_pdf) VALUES($1)", [buffer1])
    console.log("Successfully added the file to the database");
    fs.unlinkSync("./tmp/Event-Report.pdf", (error) => {
        console.error("Error:", error)
    })


    // The function to recerate the binary
    // This can be triggered only when the reqeust was received from the client
    // The file be downloaded directly
    const result = await db.query("SELECT file_pdf FROM files WHERE id = 4")
    const { file_pdf } = result.rows[0]
    console.log(file_pdf)
    const buf = new Buffer.from(file_pdf, 'binary');
    fs.writeFileSync("./tmp/Success.pdf", buf)
    console.log("Success in retrieving the data")
    
    db.end()
}

createPDF(data).catch(error => console.error('Error', error));
//readPDFFile(db).catch(err => console.error("Error", err));
