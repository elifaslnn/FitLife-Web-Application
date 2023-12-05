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

    const newuser = await postgresConnection.query(`INSERT INTO users  (mail, password, name, surname, role, birth_date, gender, phone_number, goal) VALUES ( '${req.body.mail}', crypt('${req.body.password}', gen_salt('bf',4)), '${req.body.name}',
     '${req.body.surname}', '${req.body.role}', '${req.body.birth_date}', '${req.body.gender}', '${req.body.phone_number}', '${req.body.goal}');`);

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
    if(result){
      const base64Image = result.rows[0].photo.toString('base64');
      const imageSrc = `data:image/jpeg;base64,${base64Image}`;
      res.json(imageSrc);
    }
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
    console.log("client mail : ", req.body.mail)
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

async function choose_trainer(userMail){
  try {
    let trainer
    await postgresConnection.query(`select mail from users where role='trainer'`).then(async(temp)=>{
      trainer = temp;
      //console.log("trainers : ",temp);
    })
    let found = false;
    console.log(trainer.rowCount)
    console.log(trainer.rows)
    for(let i=0;i<trainer.rowCount;i++){
      console.log("rows : ",trainer.rows[i])
      let aMail = trainer.rows[i].mail;
      console.log("active Mail : ",aMail)
      let count;
      await postgresConnection.query(`select * from client_trainer where trainer_mail='${aMail}'`).then(async(trainerM)=>{
        console.log("row C : ", trainerM.rowCount)
        count = trainerM.rowCount
      })
      if(count < 5){
        await postgresConnection.query(`select goal from users where mail='${aMail}'`).then(async(Tgoal)=>{
          await postgresConnection.query(`select goal from users where mail='${userMail}'`).then(async(Ugoal)=>{
            console.log("goals : ",Tgoal.rows[0].goal, Ugoal.rows[0].goal, aMail)
            if(Tgoal.rows[0].goal == Ugoal.rows[0].goal){
              found = true;
              console.log("last active Mail ! : ",aMail)
            }
          })
        })
      }
      if(found){
        return aMail;
      }
    }
    if(!found){
      for(let i=0;i<trainer.rowCount;i++){
        let aMail = trainer.rows[i].mail;
        let count;
        await postgresConnection.query(`select * from client_trainer where trainer_mail='${aMail}'`).then(async(trainerM)=>{
          console.log("row C : ", trainerM.rowCount)
          count = trainerM.rowCount
        })
        if(count <= 5){
          return aMail;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
}

/*async function choose_trainer(userMail){
  try {
    await postgresConnection.query(`select mail from users where role='trainer'`).then(async(trainerM)=>{
      console.log(trainerM.rows);
      let found = false;
      for(let i=0;i<trainerM.rowCount;i++){
        let aMail = trainerM.rows[i].mail;
        console.log("active Mail : ",aMail)
        const asy = trainer_C(aMail);
        asy.then(async(count)=>{
        if(count <= 5){
          await postgresConnection.query(`select goal from users where mail='${aMail}'`).then(async(Tgoal)=>{
            await postgresConnection.query(`select goal from users where mail='${userMail}'`).then(async(Ugoal)=>{
              console.log("goals : ",Tgoal, Ugoal, aMail)
              if(Tgoal == Ugoal){
                found = ture;
                console.log("active Mail : ",aMail)
                return aMail;
              }
            })
          })
        }
      })
      }
      if(!found){
        for(let i=0;i<trainerM.rowCount;i++){
          let aMail = trainerM.rows[i].mail;
          console.log(trainer_C(aMail))
          const asy = trainer_C(aMail);
          asy.then(async(count)=>{
          if(count <= 5){
            return aMail;
          }
        })
        }
      }
    }
    )
  } catch (error) {
    console.log(error);
  }
}*/

app.post("/trainer_set", async (req, res) => {
  try {
    const userMail = req.body.mail;
    console.log("mail : ",userMail)
    await postgresConnection.query(`select trainer_mail from client_trainer where client_mail='${userMail}'`).then(async(trainerM)=>{
      console.log(trainerM.rows[0]);
      if(trainerM.rows[0]){
        console.log("trainer mail zaten var")
      }else{
        const data = choose_trainer(userMail);
        data.then(async(trainerM)=>{
            console.log("final data : ",trainerM)
          await postgresConnection.query( `INSERT INTO client_trainer (client_mail, trainer_mail) VALUES ('${userMail}', '${trainerM}');`
        ).then(async(ret)=>{
          res.json(ret);
        })
        })
      }
    }
    )
  } catch (error) {
    console.log(error);
  }
});

app.post("/message", async (req, res) => {
  try {
    const userMail = req.body.sender_mail;
    const message = req.body.message;
    console.log("mail : ",userMail)
    console.log("message : ",message)
    let role;
    await postgresConnection.query(`select role from users where mail='${userMail}'`).then((tmp)=>{
      role = tmp;
    })
    console.log("role : ",role.rows[0].role);
    if(role.rows[0].role == "client"){
      console.log("role is client");
      await postgresConnection.query(`select trainer_mail from client_trainer where client_mail='${userMail}'`).then(async(trainerM)=>{
        console.log("trainerMail : ", trainerM.rows[0].trainer_mail);
        await postgresConnection.query( `INSERT INTO messages (sender_mail, receiver_mail, message) VALUES ('${userMail}', '${trainerM.rows[0].trainer_mail}', '${message}');`
        ).then(async(ret)=>{
          res.json(ret);
        })
      }
      )
  }else{
    const client_mail = req.body.client_mail;
    await postgresConnection.query( `INSERT INTO messages (sender_mail, receiver_mail, message) VALUES ('${userMail}', '${client_mail}', '${message}');`
    ).then(async(ret)=>{
      res.json(ret);
    }
    )
  }
  } catch (error) {
    console.log(error);
  }
});

app.get("/get_mail/:mail", async (req, res) => {
  try {
    let ret;
    console.log("message get mail : ",req.params.mail)
    await postgresConnection.query(
      "select * from messages where receiver_mail=$1",
      [req.params.mail]
    ).then((tmp)=>{
      ret = tmp;
    })
    console.log(ret.rows)
    res.json(ret.rows);
  } catch (error) {
    console.message(error);
  }
});

app.post("/is_enable", async (req, res) => {
  try {
    console.log("client mail : ", req.body.mail)
    const is_enable = await postgresConnection.query(
      `select is_enabled from users);`
    );

    res.json(is_enable.rows);
  } catch (error) {
    console.log(error);
  }
});

app.get("/is_enable/:mail", async (req, res) => {
  try {
    const ret = await postgresConnection.query(
      "select is_enabled from users where mail=$1",
      [req.params.mail]
    );
    res.json(ret.rows);
  } catch (error) {
    console.message(error);
  }
});

app.get('/', (req, res) => {
  res.redirect('/login.html');
});

app.get("/users", async(req,res)=>{
  try {
    const ret = await postgresConnection.query("select * from users where mail!='admin@gmail.com';")
    res.json(ret.rows)
  } catch (error) {
    console.error(error.message)
  }

})

//EGZERSİZ LİSTESİNİ ÇEK

app.get("/trainer/exercisesList", async (req, res) => {
  try {
    const ret = await postgresConnection.query("select * from exercise");
    res.json(ret.rows);
  } catch (error) {
    console.message(error);
  }
});
//trainer için danışman listesi
app.get("/trainer/client/:mail", async (req, res) => {
  try {
    const ret = await postgresConnection.query(
      "select client_mail from client_trainer where trainer_mail=$1",
      [req.params.mail]
    );
    res.json(ret.rows);
  } catch (error) {
    console.message(error);
  }
});
// trainer cliente egzersiz ataması
app.post("/trainer/addExercise", async (req, res) => {
  try {
    const newExercises = await postgresConnection.query(
      `INSERT INTO users_exercise (mail, exercise_id) VALUES ('${req.body.mail}', ${req.body.exerciseId});`
    );
    console.log("body : ", req.body);
    res.json(newExercises);
  } catch (error) {
    console.log(error);
  }
});

app.delete("/trainer/delete/:mail", async (req, res) => {
  try {
    console.log("burada");
    const newExercises = await postgresConnection.query(
      "DELETE FROM users_exercise WHERE mail = $1",
      [req.params.mail]
    );
    if (result.rows.length > 0) {
      res.status(204).send(); // Başarı durumunda 204 No Content yanıtı gönderilir
    } else {
      res
        .status(404)
        .json({ error: "Belirtilen mail adresine ait veri bulunamadı." });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

/*for (let i = 0; i < liste.length; i++) {
  try {
    await fetch(`http://localhost:5000/trainer/exercise/${mail}/${liste[i]}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        console.log(data);
      });
  } catch (error) {
    console.log(error);
  }
}*/

app.post("/trainer/addDiet", async (req, res) => {
  try {
    const newExercises = await postgresConnection.query(
      `INSERT INTO diet (goal, calorie,protein, fat, carbonhydrate) VALUES (${req.body.goal}, ${req.body.calorie}, ${req.body.calori});`
    );
    console.log("body : ", req.body);
    res.json(newExercises);
  } catch (error) {
    console.log(error);
  }
});