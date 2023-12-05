const loginBtn = document.querySelector(".logIn");
const mailInput = document.querySelector("#mail");
const passInput = document.querySelector("#password");
const signInBtn = document.getElementById("signIn");
const forgetBtn = document.getElementById("forget");

loginBtn.addEventListener("click", async function () {
  console.log("login butonu tıklandı");
  const mail = mailInput.value;
  const password = passInput.value;

  try {
    await fetch(`http://localhost:5000/logIn/${mail}/${password}`)
      .then((data) => {
        return data.text();
      })
      .then(async function (data) {
        if (data == 1) {
          findRolePath();
        } else {
          alert("kullanıcı bulunammadı");
          console.log("kullanıcı bulunamadı");
        }
      });
  } catch (error) {}
});

signInBtn.addEventListener("click", function () {
  window.location.href = 'reg.html';
})

forgetBtn.addEventListener("click", function () {
  window.location.href = 'forgot.html';
})

async function findRolePath(){
  console.log("kullanıcı bulundu");
  // kullanıcı rolüne göre sayfaya atanma işlemi
  const mail = mailInput.value;
  console.log("mail : ", mail)
  const body = {"mail": mail};
  console.log(body);
  await fetch(`http://localhost:5000/role/${mail}`,{
  method:"POST",
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify(body)
  }).then((response) => response.json())
  .then((data) => {
    const userrole = data
    console.log("user role : ",userrole);
    var dataToSend = { key: mail };
    // Convert data to a URL-encoded string
    var queryString = new URLSearchParams(dataToSend).toString();
    if(userrole == 'client'){
      // Redirect to the second page with the data in the URL
      window.location.href = 'client.html?' + queryString;
    }else if(userrole == 'trainer'){
      // Redirect to the second page with the data in the URL
      window.location.href = 'trainer.html?' + queryString;
    }else if(userrole == 'admin'){
      // Redirect to the second page with the data in the URL
      window.location.href = 'admin.html?' + queryString;            
    }else{
      alert("user role error")
    }
  })
  .catch((err) => {
     console.log(err.message);
  });
}