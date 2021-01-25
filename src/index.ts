import express, { Express } from "express";
const app: Express = express();

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send({ msg: "Hello" });
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
