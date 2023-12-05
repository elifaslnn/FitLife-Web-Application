const nameInput = document.getElementById("name");
const surnameInput = document.getElementById("surname");
const rolesInput = document.getElementById("roles");
const dateInput = document.getElementById("date");
const genderInput = document.getElementById("gender");
const phoneInput = document.getElementById("phone");
const changeDataBtn = document.getElementById("changeDataBtn");

var mail = "";

var file = "";

//photo thinks
function handleFiles(files) {
  file = files[0];
}

async function uploadFile(file) {
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



async function myFunction() {
  console.log("here ! ");
  //alert('JavaScript function is running!');
  var urlParams = new URLSearchParams(window.location.search);
  var receivedData = Object.fromEntries(urlParams.entries());
  // Use the received data
  console.log(receivedData.key);
  mail = receivedData.key;

  //tüm entrylere önceki verileri koy

  try {
    await fetch(`http://localhost:5000/change_data/${mail}`)
    .then((response) => response.json())
    .then((data) => {
      console.log("old data ", data)
      fillData(data)
    })
    .catch((err) => {
       console.log(err.message);
    });      
    }catch (error) {
        console.error(error.message);
    }
}
// Yöntem 1: window.onload kullanarak
window.onload = function() {
  console.log("here ! ");
  myFunction();
};

function fillData(data){
    nameInput.value = data.name
    surnameInput.value = data.surname
    rolesInput.value = data.role
    dateInput.value = data.birth_date
    genderInput.value = data.gender
    phoneInput.value = data.phone_number
}

changeDataBtn.addEventListener("click", async function () {
    // update data
    try {
        const body =     {
          "mail": mail,
          "name": nameInput.value,
          "surname": surnameInput.value,
          "role": rolesInput.value,
          "birth_date": dateInput.value,
          "gender": genderInput.value,
          "phone_number": phoneInput.value,
      };
        console.log(body);
        const response= await fetch("http://localhost:5000/change_data",{
          method:"POST",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(body)
        });
        if (file) {
            uploadFile(file);
          }else{
           console.log("fotoğraf değiştirilmedi");
          }
    
        console.log(response);
        
      } catch (error) {
        console.error("changeDataBtn error : ", error.message);
        
      }
    
});