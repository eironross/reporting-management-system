import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import reportRoutes from "./routes/reportRoutes.js";
import path from "path";

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join("../client", "public")));

app.set('views', path.join("../client", 'views'));

// The dashboard
app.get("/", (req, res) => {
  try {
    res.render("index.ejs", { data: "Dashboard" });
  } catch (error) {
    res.status(404).send(error.message);
  }
});

// Reports route
app.use("/report", reportRoutes)


  
app.listen(process.env.PORT_LOCAL, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT_LOCAL}`);
});


