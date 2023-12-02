import express from "express";
import cors from "cors";
import { postgresConnection } from "./db.js";
import path from "path";
import * as url from "url";
import nodemailer from "nodemailer";

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


// kullanıcı girişi kontrolü

app.get("/logIn/:mail/:password", async (req, res) => {
  try {
    const ret = await postgresConnection.query(
      "select * from users where mail= $1 and password = crypt($2, password) ",
      [req.params.mail, req.params.password]
    );
    res.json(ret.rowCount);
  } catch (err) {
    console.log(err.message);
  }
});



// emre ekledi--------------

//mail göndermek için gerekli gönderici değişkeni
var transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "8ed383b0f4ea95",
    pass: "d69500827f5e6f"
  }
});

//mail ile gönderilecek global değişken
let digit = Math.floor(1000 + Math.random() * 9000)

// forgot api bağlantısı post edildiğinde çalışır ve get eder.
// request ve response objeleri
app.post("/forgot", async(req, res) => {
  try {
    // gönderenin maili (requesterin post ettiği mail)
    console.log(req.body);
    const mail = req.body.mail;
    let returnedData = await postgresConnection.query(`select mail from users where mail='${mail}';`);
    console.log(returnedData.rows);
    if (returnedData.rowCount != 0){
      // bu mail kullanıldıysa
      // şifre girişi yapılabilir
      console.log("bu mail yeni sifre giris: ",mail);
      // 4 basamaklı bir sayı oluşturur ve gönderir
      digit = Math.floor(1000 + Math.random() * 9000)
      var mailOptions = {
        from: 'FitLife@gmail.com',
        to: `${mail}`,
        subject: 'Change Your Password',
        text: `${digit}`
      };

      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      }); 

      //change password as new one
      let returnedData = await postgresConnection.query(`update users set password = crypt('${digit}', gen_salt('bf',4)) where mail='${mail}';`);

      //returns created
      res.sendStatus(201);
    }else{
      // no content
      console.log("bu mail ile  kayit yok: ",mail);
      return res.sendStatus(400);
    }
  } catch (error) {
    console.error(error.message)
  }
})
// ----------

// trainer api

// bu hocanın danışanlarını get eden sql

app.post("/clients/:mail", async(req,res)=>{
  try {
    console.log(req.body)
    const trainerMail = req.body.mail;

    const clients = await postgresConnection.query(`select client_mail from client_trainer where trainer_mail='${trainerMail}'`);

    res.json(clients);
  } catch (error) {
    console.error("server create user error ",error.message);
  }


})

app.get("/clients/:mail", async(req,res)=>{
  try {
    const ret = await postgresConnection.query("select * from client_trainer;")
    res.json(ret.rows)
  } catch (error) {
    console.error(error.message)
  }

})

// ---------- emre eklemeyi bitirdi ----------------