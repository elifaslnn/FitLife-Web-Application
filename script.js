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



app.post("/reg", async(req,res)=>{
  try {
    console.log(req.body);

    console.log(req.body.mail)

    const newuser = await postgresConnection.query(`INSERT INTO users VALUES ( '${req.body.mail}', crypt('${req.body.password}', gen_salt('bf',4)), '${req.body.name}',
     '${req.body.surname}', '${req.body.role}', '${req.body.birth_date}', '${req.body.gender}', ${req.body.phone_number});`);

    res.json(newuser);
  } catch (error) {
    console.error("server create user error ",error.message);
    
  }


})

app.get("/reg", async(req,res)=>{
  try {
    const ret = await postgresConnection.query("select * from users;")
    res.json(ret.rows)
  } catch (error) {
    console.error(error.message)
  }

})
