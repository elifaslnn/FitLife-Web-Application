import express from "express";
import cors from "cors";
import { postgresConnection } from "./db.js";
import path from "path";
import * as url from "url";

const app = express();
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
const publicPath = path.join(__dirname, "pages");
const imgPath = path.join(__dirname, "img");

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));
app.use(express.static(imgPath));

app.listen(5000, () => {
  console.log("working");
});

//db connection
postgresConnection.connect((error) => {
  if (error) {
    console.log("no connection , error ", error.stack);
  } else {
    console.log("success");
  }
});
