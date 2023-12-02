const cards = document.querySelector(".cards");
const exerciseTable = document.querySelector("#exerciseTable");
const raport = document.querySelector("#raport");
const dietTable = document.querySelector("#dietTable");
const table = document.querySelector(".table");

const dietBtn = document.querySelector("#dietCard .btn-primary");
const exerciseBtn = document.querySelector("#exerciseCard .btn-primary");
const raportBtn = document.querySelector("#raportCard .btn-primary");

dietTable.style.display = "none";
exerciseTable.style.display = "none";
raport.style.display = "none";

dietBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  dietTable.style.display = "block";
});

exerciseBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  exerciseTable.style.display = "block";
});

raportBtn.addEventListener("click", function () {
  cards.style.display = "none";
  dietTable.style.display = "none";
  raport.style.display = "block";
});
