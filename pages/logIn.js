const loginBtn = document.querySelector(".logIn");
const mailInput = document.querySelector("#mail");
const passInput = document.querySelector("#password");

loginBtn.addEventListener("click", async function () {
  console.log("login butonu tıklandı");
  const mail = mailInput.value;
  const password = passInput.value;

  try {
    await fetch(`http://localhost:5000/logIn/${mail}/${password}`)
      .then((data) => {
        return data.text();
      })
      .then(function (data) {
        if (data == 1) {
          console.log("kullanıcı bulundu");
        } else {
          console.log("kullanıcı bulunammadı");
        }
      });
  } catch (error) {}
});
