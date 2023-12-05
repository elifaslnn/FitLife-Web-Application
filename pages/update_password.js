const passwInput = document.getElementById("new_password");
const old_Input = document.getElementById("old_password");
const confirm_Input = document.getElementById("confirm_password");
const changePasswordBtn = document.getElementById("changePasswordBtn");

////////////////
// import * as sql_lib from "./sql_lib.js";
//var sql_lib = require("./libs/sql_lib.js");


let mail = "sonemre41@gmail.com";

async function myFunction() {
  console.log("here ! ");
  //alert('JavaScript function is running!');
  var urlParams = new URLSearchParams(window.location.search);
  var receivedData = Object.fromEntries(urlParams.entries());
  // Use the received data
  console.log(receivedData);
  mail = receivedData.key;
}
// Yöntem 1: window.onload kullanarak
window.onload = function() {
  console.log("here ! ");
  myFunction();
};

changePasswordBtn.addEventListener("click", async function () {
  console.log("login butonu tıklandı");
  const password = old_Input.value;
  try {
    await fetch(`http://localhost:5000/logIn/${mail}/${password}`)
      .then((data) => {
        return data.text();
      })
      .then(async function (data) {
        if (data == 1) {
            if(passwInput.value == confirm_Input.value){
                changePassword();
            }else{
                alert("confirmation error")
            }
        } else {
          alert("parola bulunamadı");
          console.log("parola bulunamadı");
        }
      });
  } catch (error) {}
});

async function changePassword(){
    try {
        const body = {
            "mail" : mail,
            "password": passwInput.value
      };
        console.log(body);
          await fetch("http://localhost:5000/change_password",{
          method:"POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body)
        });      
        }catch (error) {
            console.error(error.message);
        }
}
