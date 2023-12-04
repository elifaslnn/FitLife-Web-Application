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

//kullanıı rolünü döndüren api
app.post("/role/:mail", async(req,res)=>{
  try {
    const userMail = req.body.mail;
    console.log("mail : ",userMail)
    const role = await postgresConnection.query(`select role from users where mail='${userMail}'`);
    console.log("role : ",role.rows[0].role);
    res.json(role.rows[0].role);
  } catch (error) {
    console.error("server post role user error ",error.message);
  }
})

// trainer ana verileri döndürür
app.post("/trainer/data/:mail", async(req,res)=>{
  try {
    const userMail = req.body.mail;
    console.log("mail : ",userMail)
    const trainer_data = await postgresConnection.query(`select * from trainer where mail='${userMail}'`);
    const trainer_name = await postgresConnection.query(`select name, surname from users where mail='${userMail}'`);
    const trainer_contact = await postgresConnection.query(`select phone_number from users where mail='${userMail}'`);
    console.log("trainer_data : ",trainer_data);
    const data = {"nameSurname" : trainer_name.rows[0].name + trainer_name.rows[0].surname,
                "prof":trainer_data.rows[0].prof,
                "experience":trainer_data.rows[0].experience,
                "contact":trainer_contact.rows[0].phone_number};
    res.json(data);
    console.log("data : ",data)
  } catch (error) {
    console.error("server post trainer user error ",error.message);
  }
})


app.post("/change_password", async(req,res)=>{
  try {
    const changed_password = await postgresConnection.query(`UPDATE users set password=crypt('${req.body.password}', gen_salt('bf',4)) where mail='${req.body.mail}' ;`);

    res.json(changed_password);
  } catch (error) {
    console.error("server create user error ",error.message);
  }
})

app.get("/change_data/:mail", async(req,res)=>{
  try {
    const mail = req.params.mail;
    console.log("mail : ",mail);
    const ret = await postgresConnection.query(`select * from users where mail='${mail}';`);
    console.log(ret.rows)
    res.json(ret.rows[0]);
  } catch (error) {
    console.error(error.message)
  }
})

app.post("/change_data", async(req,res)=>{
  try {
    const mail = req.body.mail;
    console.log("mail : ",mail);
    const changed_password = await postgresConnection.query(`UPDATE users set name='${req.body.name}', surname='${req.body.surname}',
    role='${req.body.role}', birth_date='${req.body.birth_date}', gender='${req.body.gender}', phone_number='${req.body.phone_number}',
    photo='${req.body.photo}' where mail='${req.body.mail}' ;`);

    res.json(changed_password);
  } catch (error) {
    console.error(error.message)
  }
})



//dragDrop

import multer from "multer";


// Multer konfigürasyonu
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Dosya yükleme endpoint'i
app.post('/upload', upload.single('photo'), async (req, res) => {
  try {
    // Dosya verisini al
    const fileBuffer = req.file.buffer;
    const mail = req.body.mail;
    console.log(mail)

    // PostgreSQL'e yaz
    const query = `UPDATE users SET photo = $1 WHERE mail='${mail}';`;
    await postgresConnection.query(query, [fileBuffer]);

    res.send('Dosya başarıyla yüklendi ve veritabanına kaydedildi.');
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu.');
  }
});

app.get('/upload/:mail', async (req, res) => {
  try {
    // Dosya verisini al
    const mail = req.params.mail;
    console.log(mail)

    // PostgreSQL'e yaz
    const query = `select photo from users WHERE mail='${mail}';`;
    const result = await postgresConnection.query(query);
    const base64Image = result.rows[0].photo.toString('base64');
    const imageSrc = `data:image/jpeg;base64,${base64Image}`;
    res.json(imageSrc);
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu.');
  }
});

///////// CLİENT BİLGİLERİNİ ÇEKME ////////////////
app.get("/client/:mail", async (req, res) => {
  try {
    const ret = await postgresConnection.query(
      "select * from users  inner join users_progress on users.mail= users_progress.mail  where users.mail= $1",
      [req.params.mail]
    );
    res.json(ret.rows[0]);
  } catch (error) {
    error.message(error);
  }
});

//kullanıcı diet bilgilerini çek
app.get("/client/diet/:mail", async (req, res) => {
  try {
    const ret = await postgresConnection.query(
      "select * from diet inner join users_diet on diet.id= users_diet.diet_id  where users_diet.mail= $1",
      [req.params.mail]
    );
    res.json(ret.rows[0]);
  } catch (error) {
    console.message(error);
  }
});

//kullanıcı egzersiz bilgilerini çek
app.get("/client/exercise/:mail", async (req, res) => {
  try {
    const ret = await postgresConnection.query(
      "select * from exercise inner join users_exercise on exercise.id= users_exercise.exercise_id where users_exercise.mail= $1",
      [req.params.mail]
    );
    res.json(ret.rows);
  } catch (error) {
    console.message(error);
  }
});

//kullanıcının güncel durumunun sisteme kayıdı
app.post("/client", async (req, res) => {
  try {
    const newRaport = await postgresConnection.query(
      `INSERT INTO users_progress (mail, weight, height, fat_rate, muscle_mass, body_mass_index) VALUES ('${req.body.mail}', ${req.body.weight}, ${req.body.height}, ${req.body.fat_rate}, ${req.body.muscle_mass}, ${req.body.body_mass_index});`
    );

    res.json(newRaport);
  } catch (error) {
    console.log(error);
  }
});

//kullanıcıya ait raporları çek

app.get("/client/raport/:mail", async (req, res) => {
  try {
    const ret = await postgresConnection.query(
      "select * from users_progress where mail=$1",
      [req.params.mail]
    );
    res.json(ret.rows);
  } catch (error) {
    console.message(error);
  }
});