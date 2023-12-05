const mailInput = document.getElementById("email");
const passwInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const rolesInput = document.getElementById("roles");
const dateInput = document.getElementById("date");
const genderInput = document.getElementById("gender");
const phoneInput = document.getElementById("phone");
const signBtn = document.getElementById("signBtn");
const goalInput = document.getElementById("goal");
////////////////
// import * as sql_lib from "./sql_lib.js";
//var sql_lib = require("./libs/sql_lib.js");


var file = "";

//photo thinks
function handleFiles(files) {
  file = files[0];
}

async function uploadFile(file) {
  const mail = mailInput.value; 
  const formData = new FormData();
  formData.append('photo', file);
  formData.append('mail', mail);
  console.log(mail)

  await fetch('/upload', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.text())
  .then(message => {
    console.log(message);
  })
  .catch(error => {
    console.error('Hata:', error);
  });
}

async function set_trainer() {
  const mail = mailInput.value; 
  const body = {"mail": mail};

  await fetch('/trainer_set', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  })
  .catch(error => {
    console.error('Hata:', error);
  });
}

async function clientSetData() {
  try {
    const mail = mailInput.value; 
    const body = {
      mail: mail,
      weight: 0,
      height: 0,
      fat_rate: 0,
      muscle_mass: 0,
      body_mass_index: 0,
    };
    console.log(body);
    const response = await fetch(`http://localhost:5000/client`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error(error.message);
  }
};

function visible_passwd() {
  var x = document.getElementById("password");
  if (x.type === "password") {
    x.type = "text";
  } else {
    x.type = "password";
  }
}

signBtn.addEventListener("click", async function () {
  console.log(mailInput.value);
  console.log(passwInput.value);
  console.log(nameInput.value);
  console.log(surnameInput.value);
  console.log(rolesInput.value);
  console.log(dateInput.value);
  console.log(genderInput.value);
  console.log(phoneInput.value);
  console.log(goalInput.value);
  // api den backende gönder

  try {
    const description = mailInput.value;
    const mail = document.getElementById("email").value; 
    const body =     {
      "mail": mailInput.value,
      "password": passwInput.value,
      "name": nameInput.value,
      "surname": surnameInput.value,
      "role": rolesInput.value,
      "birth_date": dateInput.value,
      "gender": genderInput.value,
      "phone_number": phoneInput.value,
      "goal": goalInput.value,
      "photo": null
  };
    console.log(description);
    console.log(body);
    const response= await fetch("http://localhost:5000/reg",{
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    }).then(()=>{
      if (file) {
        uploadFile(file)
        alert("photo setted")
      }else{
        alert("photo file error")
      }
      if(rolesInput.value == "client"){
        clientSetData().then(async()=>{
          set_trainer();
          alert("trainer atanıyor")
        })

      }else{
        alert("trainer oluşturuldu")
      }
      alert("user created.")
      window.location.href = 'login.html';
    })
    
  } catch (error) {
    console.error(error.message);
    
  }

  //const response= await fetch("http://localhost:5000/reg");   GET
  //const jsonData= response.json();

});