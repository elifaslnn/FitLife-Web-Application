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
const showRaportBtn = document.querySelector("#showRaportButton");
const MsgBtn = document.getElementById("messagebtn");
const messageInput = document.getElementById("messageInput");
const messagevievBtn = document.getElementById("messagevievbtn");
const messager = document.querySelector("#messager");
const messageList = document.getElementById("messageList");




dietTable.style.display = "none";
exerciseTable.style.display = "none";
raport.style.display = "none";
previousBtn.style.display = "none";
raportInfo.style.display = "none";
messager.style.display = "none";

dietBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  raportInfo.style.display = "none";
  dietTable.style.display = "block";
  previousBtn.style.display = "block";
  messager.style.display = "none";
});

exerciseBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  raportInfo.style.display = "none";
  exerciseTable.style.display = "block";
  previousBtn.style.display = "block";
  messager.style.display = "none";
});

addRaportBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  raportInfo.style.display = "none";
  raport.style.display = "block";
  previousBtn.style.display = "block";
  messager.style.display = "none";
});

previousBtn.addEventListener("click", function () {
  cards.style.display = "flex";
  dietTable.style.display = "none";
  exerciseTable.style.display = "none";
  raport.style.display = "none";
  previousBtn.style.display = "none";
  raportInfo.style.display = "none";
  messager.style.display = "none";
});

messagevievBtn.addEventListener("click", async function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  raportInfo.style.display = "none";
  raport.style.display = "block";
  previousBtn.style.display = "block";
  messager.style.display = "block";
  getMessages();
});

async function getMessages() {
  mail = receivedData.key;
  console.log(mail)
  await fetch(`/get_mail/${mail}`).then((data) => {
    return data.json();
  })
  .then(function (data) {
    console.log("data : ",data);
    for(let i = 0; i < data.length; i++){
      const message = document.createElement("li")
      message.className="card-text"
      message.innerHTML = data[i].message
      messageList.appendChild(message)
    }
  });
}


async function send_message(message) {
  mail = receivedData.key;
  console.log(mail)
  const body = {"sender_mail": mail,
                "message" : message};

  await fetch('/message', {
    method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(body)
  })
  .catch(error => {
    console.error('Hata:', error);
  });
}

MsgBtn.addEventListener("click", async function () {
  //send mail to trainer
  console.log("message : ",messageInput.value)
  send_message(messageInput.value)

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
        console.log(data)
        let i = data.length - 1;
        console.log("i : ",i, data.length);
        document.getElementById("nameSurname").innerText =
          data[i].name + " " + data[i].surname;
        document.getElementById("age").innerHTML = data[i].birth_date;
        document.getElementById("weight").innerHTML = data[i].weight + " kg";
        document.getElementById("height").innerHTML = data[i].height + " cm";
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
        const ul = document.createElement("ul");
        for (let i = 0; i < data.length; i++) {
          const li = document.createElement("li");
          li.textContent =
            data[i].name +
            "/" +
            data[i].repate +
            " tekrar/" +
            data[i].set +
            " set";
          li.classList = "exerciseLists";
          li.id = data[i].video;
          li.style.cursor = "pointer";
          console.log("li id: " + li.id);
          ul.appendChild(li);
        }
        exerciseTable.appendChild(ul);
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

const videoFrame = document.getElementById("videoFrame");
exerciseTable.addEventListener("click", function (e) {
  console.log(e.target.id);
  //embed= "https://www.youtube.com/embed/vB5OHsJ3EME?si=FZnlG1LP2qkqLeJw"
  //url= https://www.youtube.com/watch?v=vB5OHsJ3EME
  let newString = e.target.id.replaceAll("watch?v=", "embed/");
  videoFrame.src = newString;
});

window.onload = function () {
  myFunction();
  getFile();
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

const changeDataPageBtn = document.getElementById("changeDataPageBtn");
const changePasswordPageBtn = document.getElementById("changePasswordPageBtn");


changeDataPageBtn.addEventListener("click", async function () {
  var dataToSend = { key: mail };
  // Convert data to a URL-encoded string
  var queryString = new URLSearchParams(dataToSend).toString();
  window.location.href = 'update_data.html?' + queryString;
});

changePasswordPageBtn.addEventListener("click", async function () {
  var dataToSend = { key: mail };
  // Convert data to a URL-encoded string
  var queryString = new URLSearchParams(dataToSend).toString();
  window.location.href = 'update_password.html?' + queryString;
});


//get photo
async function getFile() {
    const body = {"mail": mail};
    console.log(mail)
  
    await fetch(`/upload/${mail}`, {
    })
    .then(response => response.json())
    .then(result => {
        console.log(result)

        document.getElementById("img").src = result
    })
    .catch(error => {
      console.error('Hata:', error);
    });
  }
