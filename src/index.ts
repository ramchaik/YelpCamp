import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app: Express = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const PORT = process.env.SERVER_PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.render("home");
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
