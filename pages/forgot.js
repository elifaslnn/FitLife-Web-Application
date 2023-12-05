
const mailInput = document.getElementById("email");
const forgotBtn = document.getElementById("forgotBtn");

// unuttum butonu basıldığında
forgotBtn.addEventListener("click", async function () {
    console.log("Forgot clicked")
    console.log(mailInput.value);
    // api den backende gönder
  
    try {
        //mail bilgisini forgot alanına gönderir
        const body = {"mail": mailInput.value};
        console.log(body);
        const response= await fetch("http://localhost:5000/forgot",{
        method:"POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body)
    });
      console.log(response);
      alert("password degistirildi")
      window.location.href = 'login.html';
    } catch (error) {
      console.error(error.message);
    } 
  });