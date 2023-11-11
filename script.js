const { Client } = require("pg");
const client = new Client({
  user: "postgres",
  host: "fitlife.covtsuyb4can.eu-north-1.rds.amazonaws.com",
  database: "fitLife",
  password: "210201eE",
  port: 5432,
});
client.connect(function (err) {
  if (err) {
    console.log("Connected!");
  } else {
    console.log("ERROR!");
  }
});

console.log("merhaba emre <3");
