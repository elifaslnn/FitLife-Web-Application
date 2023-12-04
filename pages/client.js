const cards = document.querySelector(".cards");
const exerciseTable = document.querySelector("#exerciseTable");
const raport = document.querySelector("#raport");
const dietTable = document.querySelector("#dietTable");
const table = document.querySelector(".table");
const previousBtn = document.querySelector(".previous");
const raportInfo = document.querySelector("#raportInfo");
const dietBtn = document.querySelector("#dietCard .btn-primary");
const exerciseBtn = document.querySelector("#exerciseCard .btn-primary");
const addRaportBtn = document.querySelector("#raportCard .btn-primary");
const showRaportBtn = document.querySelector(".table button");

dietTable.style.display = "none";
exerciseTable.style.display = "none";
raport.style.display = "none";
previousBtn.style.display = "none";
raportInfo.style.display = "none";

dietBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  raportInfo.style.display = "none";
  dietTable.style.display = "block";
  previousBtn.style.display = "block";
});

exerciseBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  raportInfo.style.display = "none";
  exerciseTable.style.display = "block";
  previousBtn.style.display = "block";
});

addRaportBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  raportInfo.style.display = "none";
  raport.style.display = "block";
  previousBtn.style.display = "block";
});

previousBtn.addEventListener("click", function () {
  cards.style.display = "flex";
  dietTable.style.display = "none";
  exerciseTable.style.display = "none";
  raport.style.display = "none";
  previousBtn.style.display = "none";
  raportInfo.style.display = "none";
});

showRaportBtn.addEventListener("click", async function () {
  try {
    const body = {
      mail: mail,
      weight: document.querySelector("#r0").value,
      height: document.querySelector("#r1").value,
      fat_rate: document.querySelector("#r2").value,
      muscle_mass: document.querySelector("#r3").value,
      body_mass_index: document.querySelector("#r4").value,
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
  raportInfo.style.display = "flex";
  raport.style.display = "none";
});

let mail;
var urlParams = new URLSearchParams(window.location.search);
var receivedData = Object.fromEntries(urlParams.entries());

console.log(receivedData.key);
mail = receivedData.key;

async function myFunction() {
  console.log("here ! ");
  var urlParams = new URLSearchParams(window.location.search);
  var receivedData = Object.fromEntries(urlParams.entries());

  console.log(receivedData.key);
  mail = receivedData.key;

  try {
    await fetch(`http://localhost:5000/client/${mail}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        document.getElementById("nameSurname").innerText =
          data.name + " " + data.surname;
        document.getElementById("age").innerHTML = data.birth_date;
        document.getElementById("weight").innerHTML = data.weight + " kg";
        document.getElementById("height").innerHTML = data.height + " cm";
      });
  } catch (error) {
    console.log(error);
  }

  try {
    await fetch(`http://localhost:5000/client/diet/${mail}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        document.getElementById("dgoal").innerHTML = "Hedef: " + data.goal;
        document.getElementById("dcalorie").innerHTML =
          "Kalori: " + data.calorie + " kalori";
        document.getElementById("dprotein").innerHTML =
          "Protein: " + data.protein + " gr";
        document.getElementById("dfat").innerHTML = "Yağ: " + data.fat + " gr";
        document.getElementById("dcarbonhydrate").innerHTML =
          "Karbonhidrat: " + data.carbohydrate + " gr";
      });
  } catch (error) {
    console.log(error);
  }

  try {
    await fetch(`http://localhost:5000/client/exercise/${mail}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        for (let i = 0; i < data.length; i++) {
          document.getElementById("e" + i).innerHTML =
            data[i].name +
            "/" +
            data[i].repate +
            " tekrar/" +
            data[i].set +
            " set";
        }
      });
  } catch (error) {
    console.log(error);
  }

  try {
    await fetch(`http://localhost:5000/client/raport/${mail}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        console.log(data);
        var ul = document.createElement("ul");

        for (let i = 0; i < data.length; i++) {
          var li0 = document.createElement("li");

          li0.textContent =
            "Boy: " +
            data[i].height +
            " Kilo: " +
            data[i].weight +
            " Yağ Oranı: " +
            data[i].fat_rate +
            " Kas Kütlesi: " +
            data[i].muscle_mass +
            " Vücut Kitle Endeksi: " +
            data[i].body_mass_index;
          ul.appendChild(li0);

          raportInfo.appendChild(ul);
          var hr = document.createElement("hr");
          var br = document.createElement("br");
          raportInfo.appendChild(br);

          raportInfo.appendChild(hr);
        }
      });
  } catch (error) {
    console.log(error);
  }
}

window.onload = function () {
  myFunction();
};
// document
//   .querySelector(".exersiceList button")
//   .addEventListener("click", function (e) {
//     console.log(e.target);
//   });
// window.onload = function () {
//   console.log("here ! ");
//   myFunction();
// };
