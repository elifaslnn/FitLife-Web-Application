const mailInput = document.getElementById("email");
const passwInput = document.getElementById("password");
const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const rolesInput = document.getElementById("roles");
const dateInput = document.getElementById("date");
const genderInput = document.getElementById("gender");
const phoneInput = document.getElementById("phone");
const signBtn = document.getElementById("signBtn");
////////////////
// import * as sql_lib from "./sql_lib.js";
//var sql_lib = require("./libs/sql_lib.js");

function visible_passwd() {
  var x = document.getElementById("password_visible");
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
      "photo": null
  };
    console.log(description);
    console.log(body);
    const response= await fetch("http://localhost:5000/reg",{
      method:"POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(body)
    });

    console.log(response);
    
  } catch (error) {
    console.error(error.message);
    
  }

  //const response= await fetch("http://localhost:5000/reg");   GET
  //const jsonData= response.json();

});
