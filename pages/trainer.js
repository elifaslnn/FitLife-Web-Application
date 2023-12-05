// Antrenör rolü, danışanlara egzersiz planları oluşturmak ve ilerlemelerini izlemek için gereken yetkilere sahiptir.
/*

○ Antrenörler, kendi profil bilgilerini düzenleyebilir. Antrenörlerin profil
bilgileri; ad, soyad, uzmanlık alanları (kilo aldırma, kilo verdirme, kilo
koruma, kas kazanma), deneyimleri, iletişim bilgileri gibi bilgilerden
oluşmalıdır.
○ Kendilerine atanmış danışanların bilgilerine erişebillir. İlerlemelerini ve
planlarını kontrol edebilir.
○ Danışanları için özel egzersiz programları oluşturabilir, bunları güncelleyebilir
ve danışanlarıyla paylaşabilir. Programlar; egzersiz adı, hedefleri (kilo alma,
kilo verme, kiloyu koruma, kas kazanma), set ve tekrar sayıları, video
rehberleri, programa başlama tarihini ve programın süresini içermelidir.
○ Danışanları için özel beslenme planlarını oluşturabilir, bunları güncelleyebilir
ve danışanlarıyla paylaşabilir. Beslenme planları; hedef (kilo alma, kilo verme,
kiloyu koruma, kas kazanma), günlük öğünler ve kalori hedefini içermelidir.
○ Danışanlarıyla iletişim kurabilir, mesajları yönetebilir.
○ Antrenörler, kullanıcıları veya diğer antrenörleri yönetme yetkisine sahip
değildir.

Danışan - Antrenör Eşleştirmesi:
● Danışan sisteme kişisel bilgi ve hedeflerini girdikten sonra danışan-antrenör
eşleştirmesi yapılacaktır. Antrenör atama işlemi sistematik bir şekilde antrenörlerin
uzmanlık alanlarına ve ilgilendikleri kişi sayıları göz önünde bulundurularak
yapılacaktır.
● Her antrenörün en fazla 5 danışanı bulunmalıdır

*/

// get add danışan

let mail = "sonemre41@gmail.com";

async function myFunction() {
  console.log("here ! ");
  //alert('JavaScript function is running!');
  var urlParams = new URLSearchParams(window.location.search);
  var receivedData = Object.fromEntries(urlParams.entries());
  // Use the received data
  console.log(receivedData);
  mail = receivedData.key;
  updateSelfData();
}
// Yöntem 1: window.onload kullanarak
window.onload = function () {
  console.log("here ! ");
  myFunction();
  getExecisesList();
  getClient();
  // exersiceList.style.display = "none";
};

async function updateSelfData() {
  const body = { mail: mail };
  console.log(body);
  await fetch(`http://localhost:5000/trainer/data/${mail}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      updateSelfFrontend(data);
      getFile();
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function updateSelfFrontend(data) {
  const nameLabel = document.getElementById("name");
  const profLabel = document.getElementById("prof");
  const experienceLabel = document.getElementById("experience");
  const contactLabel = document.getElementById("contact");

  nameLabel.innerHTML = "Ad Soyad : " + data.nameSurname;
  //kilo aldırma, kilo verdirme, kilo koruma, kas kazanma
  profLabel.innerHTML = "uzmanlık alanı : " + data.prof;
  experienceLabel.innerHTML = "deneyim : " + data.experience;
  contactLabel.innerHTML = "iletişim : " + data.contact;
}

const changeDataPageBtn = document.getElementById("changeDataPageBtn");
const changePasswordPageBtn = document.getElementById("changePasswordPageBtn");

changeDataPageBtn.addEventListener("click", async function () {
  var dataToSend = { key: mail };
  // Convert data to a URL-encoded string
  var queryString = new URLSearchParams(dataToSend).toString();
  window.location.href = "update_data.html?" + queryString;
});

changePasswordPageBtn.addEventListener("click", async function () {
  var dataToSend = { key: mail };
  // Convert data to a URL-encoded string
  var queryString = new URLSearchParams(dataToSend).toString();
  window.location.href = "update_password.html?" + queryString;
});

//photo thinks
function handleFiles(files) {
  const file = files[0];

  if (file) {
    uploadFile(file);
  }
}

function uploadFile(file) {
  const formData = new FormData();
  formData.append("photo", file);
  formData.append("mail", mail);
  console.log(mail);

  fetch("/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.text())
    .then((message) => {
      console.log(message);
    })
    .catch((error) => {
      console.error("Hata:", error);
    });
}

async function getFile() {
  const body = { mail: mail };
  console.log(mail);

  await fetch(`/upload/${mail}`, {})
    .then((response) => response.json())
    .then((result) => {
      console.log(result);

      document.getElementById("img").src = result;
    })
    .catch((error) => {
      console.error("Hata:", error);
    });
}
///////
//////
///////
///////
const exerciseTable = document.querySelector("#exerciseTable");
const dietTable = document.querySelector("#dietTable");
const previousBtn = document.querySelector(".previous");
const cards = document.querySelector(".cards");
const kasLists = document.querySelector("#kas");
const kiloAlmaLists = document.querySelector("#kiloAlma");
const kiloVermeLists = document.querySelector("#kiloVerme");

dietTable.style.display = "none";
exerciseTable.style.display = "none";

async function getExecisesList() {
  try {
    await fetch(`http://localhost:5000/trainer/exercisesList`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        console.log(data);
        console.log(data.length);
        for (let i = 0; i < data.length; i++) {
          const form_check = document.createElement("div");
          form_check.className = "form-check";
          const input = document.createElement("input");
          input.className = "form-check-input";
          input.type = "checkbox";
          input.id = data[i].id;
          const label = document.createElement("label");
          label.className = "form-check-label";
          label.for = "flexCheckDefault";

          form_check.appendChild(label);
          form_check.appendChild(input);
          label.innerHTML = data[i].name;

          console.log(data[i].goal);
          if (data[i].goal == "kilo alma") {
            console.log("kilo alma");
            kiloAlmaLists.appendChild(form_check);
          } else if (data[i].goal == "kilo verme") {
            kiloVermeLists.appendChild(form_check);
          } else if ((data[i].goal = "kas")) {
            kasLists.appendChild(form_check);
          }
        }
      });
  } catch (error) {
    console.log(error);
  }
}

const formSelect = document.querySelector(".form-select");
async function getClient() {
  try {
    await fetch(`http://localhost:5000/trainer/client/${mail}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        console.log(data);
        for (let i = 0; i < data.length; i++) {
          const option = document.createElement("option");
          option.innerHTML = data[i].client_mail;
          formSelect.appendChild(option);
        }
      });
  } catch (error) {
    console.log(error);
  }
}

async function getClientsDiet(email) {
  try {
    await fetch(`http://localhost:5000/client/diet/${email}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        console.log(data);
        /*<ul class="exersiceList">
        <li id="dgoal">Hedef:</li>
        <li id="dcalorie">Kalori:</li>
        <li id="dprotein">Protein:</li>
        <li id="dfat">Yağ:</li>
        <li id="dcarbonhydrate">Karbonhidrat:</li>
      </ul>*/
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
}

async function getClientsExercise(email) {
  try {
    await fetch(`http://localhost:5000/client/exercise/${email}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        const exercise = document.getElementById("clientsExercises");
        while (exercise.firstChild) {
          exercise.removeChild(exercise.firstChild);
        }
        const img = document.createElement("img");
        img.src = "img/exerciseTable.jfif";
        const div = document.createElement("div");
        div.className = "dietTableImg";
        div.appendChild(img);
        exercise.append(div);
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
        document.getElementById("clientsExercises").appendChild(ul);
      });
  } catch (error) {
    console.log(error);
  }
}

async function getClientRapor(email) {
  try {
    await fetch(`http://localhost:5000/client/raport/${email}`)
      .then((data) => {
        return data.json();
      })
      .then(function (data) {
        console.log(data);
        const rapor = document.getElementById("clientsRapor");

        while (rapor.firstChild) {
          rapor.removeChild(rapor.firstChild);
        }

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

          document.getElementById("clientsRapor").appendChild(ul);

          var hr = document.createElement("hr");
          var br = document.createElement("br");
          // document.getElementById("clientsRapor").appendChild(br)
          // document.getElementById("clientsRapor").appendChild(br)

          // raportInfo.appendChild(br);
          // raportInfo.appendChild(hr);
        }
      });
  } catch (error) {
    console.log(error);
  }
}

const clientsDietBtn = document.querySelector("#eDiet");
const clientsExercisesBtn = document.querySelector("#eExercise");
const clientsRaporBtn = document.querySelector("#eRapor");
const raporTable = document.querySelector("#raporTable");
const clientsDiet = document.querySelector("#clientsDiet");
const clientsExercises = document.querySelector("#clientsExercises");
const clientsRapor = document.querySelector("#clientsRapor");
const raportCard = document.querySelector("#raportCard");

clientsDiet.style.display = "none";
clientsExercises.style.display = "none";
clientsRapor.style.display = "none";
raporTable.style.display = "none";

clientsDietBtn.addEventListener("click", function () {
  raporTable.style.display = "none";
  console.log(formSelect.value);
  raporTable.style.display = "none";
  clientsDiet.style.display = "flex";
  clientsExercises.style.display = "none";
  clientsRapor.style.display = "none";
  getClientsDiet(formSelect.value);
});
clientsExercisesBtn.addEventListener("click", function () {
  raporTable.style.display = "none";

  clientsDiet.style.display = "none";
  clientsRapor.style.display = "none";
  clientsExercises.style.display = "flex";
  getClientsExercise(formSelect.value);
});
clientsRaporBtn.addEventListener("click", function () {
  raporTable.style.display = "none";

  clientsDiet.style.display = "none";
  clientsRapor.style.display = "flex";
  clientsExercises.style.display = "none";
  getClientRapor(formSelect.value);
});

const backButton = document.querySelector(".previous");
backButton.addEventListener("click", function () {
  cards.style.display = "flex";
  dietTable.style.display = "none";
  exerciseTable.style.display = "none";
  clientsDiet.style.display = "none";
  clientsExercises.style.display = "none";
  clientsRapor.style.display = "none";
  raporTable.style.display = "none";
});

const dietBtn = document.querySelector("#dietCard .btn-primary");
const exerciseBtn = document.querySelector("#exerciseCard .btn-primary");
const addRaportBtn = document.querySelector("#raportCard .btn-primary");

dietBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "flex";
  raporTable.style.display = "none";
  exerciseTable.style.display = "none";
});
exerciseBtn.addEventListener("click", function () {
  cards.style.display = "none";
  exerciseTable.style.display = "flex";
  raporTable.style.display = "none";
  dietTable.style.display = "none";
});
addRaportBtn.addEventListener("click", function () {
  cards.style.display = "none";
  raporTable.style.display = "flex";
  exerciseTable.style.display = "none";
  dietTable.style.display = "none";
});

const editDietPlan = document.querySelector(".editDietPlan");
const editEPlan = document.querySelector(".editEPlan");

// exerciseTable.addEventListener("click", function (e) {
//   console.log(e.target.checked);
// });
editEPlan.addEventListener("click", async function () {
  var liste = [];
  for (let i = 0; i < exerciseTable.childNodes.length; i++) {
    for (let j = 0; j < exerciseTable.childNodes[i].childNodes.length; j++) {
      if (
        exerciseTable.childNodes[i].childNodes[j].className === "form-check"
      ) {
        if (exerciseTable.childNodes[i].childNodes[j].childNodes[1].checked) {
          liste.push(
            exerciseTable.childNodes[i].childNodes[j].childNodes[1].id
          );
        }
      }
    }
  }
  console.log(liste);
  const mail = formSelect.value;
  console.log(mail);
  for (let i = 0; i < liste.length; i++) {
    try {
      const body = {
        mail: mail,
        exerciseId: liste[i],
      };
      console.log(body);
      await fetch(`http://localhost:5000/trainer/addExercise`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then(function (data) {
        console.log(data);
      });
    } catch (error) {
      console.log(error);
    }
  }
});

editDietPlan.addEventListener("click", async function () {
  try {
    console.log("add diet run")
    console.log()
    const body = {
      mail: mail,
      goal: document.querySelector("#goalSelect").value,
      calorie: document.querySelector("#r1").value,
      protein: document.querySelector("#r2").value,
      fat: document.querySelector("#r3").value,
      carbohydrate: document.querySelector("#r4").value,
    };
    await fetch(`http://localhost:5000/trainer/addDiet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then(function (data) {
      console.log("here1 : ",data);
      return data.json();
    }).then(async(data) => {
      console.log("here : ",data[0].id);
      const user_body = {
        mail: formSelect.value,
        dietId: data[0].id,
      };
      console.log(data.id)
      await fetch(`http://localhost:5000/trainer/addDietUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user_body),
      }).then(function (userdata) {
        console.log(userdata);
      });

    });
  } catch (error) {
    console.log(error);
  }
});
