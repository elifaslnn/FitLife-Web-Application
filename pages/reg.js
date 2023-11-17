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
function get_users_data() {
  console.log(mailInput.value);
  console.log(passwInput.value);
  console.log(nameInput.value);
  console.log(surnameInput.value);
  console.log(rolesInput.value);
  console.log(dateInput.value);
  console.log(genderInput.value);
  console.log(phoneInput.value);
  sql_lib.create_user(
    mailInput.value,
    passwInput.value,
    nameInput.value,
    surnameInput.value,
    rolesInput.value,
    dateInput.value,
    genderInput.value,
    phoneInput.value
  );
}

signBtn.addEventListener("click", function () {
  console.log(mailInput.value);
  console.log(passwInput.value);
  console.log(nameInput.value);
  console.log(surnameInput.value);
  console.log(rolesInput.value);
  console.log(dateInput.value);
  console.log(genderInput.value);
  console.log(phoneInput.value);
  sql_lib.create_user(
    mailInput.value,
    passwInput.value,
    nameInput.value,
    surnameInput.value,
    rolesInput.value,
    dateInput.value,
    genderInput.value,
    phoneInput.value
  );
});
