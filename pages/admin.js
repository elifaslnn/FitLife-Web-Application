const cards = document.querySelector(".cards");
const regBtn = document.getElementById("regBtn");
const regInfo = document.querySelector("#regInfo");

regInfo.style.display = "none";

regBtn.addEventListener("click", function () {
    window.location.href = 'reg.html';
  });


let mail;
var urlParams = new URLSearchParams(window.location.search);
var receivedData = Object.fromEntries(urlParams.entries());

console.log(receivedData.key);
mail = receivedData.key;


window.onload = function () {

};

