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
window.onload = function() {
  console.log("here ! ");
  myFunction();
};

async function updateSelfData(){
  const body = {"mail": mail};
  console.log(body);
  await fetch(`http://localhost:5000/trainer/data/${mail}`,{
  method:"POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify(body)
  }).then((response) => response.json())
  .then((data) => {
    console.log(data)
    updateSelfFrontend(data)
    getFile();
  })
  .catch((err) => {
     console.log(err.message);
  });
}

function updateSelfFrontend(data){
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
  window.location.href = 'update_data.html?' + queryString;
});

changePasswordPageBtn.addEventListener("click", async function () {
  var dataToSend = { key: mail };
  // Convert data to a URL-encoded string
  var queryString = new URLSearchParams(dataToSend).toString();
  window.location.href = 'update_password.html?' + queryString;
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
  formData.append('photo', file);
  formData.append('mail', mail);
  console.log(mail)

  fetch('/upload', {
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