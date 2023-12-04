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
  getFile();
};

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