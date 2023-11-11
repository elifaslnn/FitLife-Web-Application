import pg from 'pg'
 
const postgresConnection = new pg.Pool({
  host: 'database-1.cf1n4shvkpyh.us-east-1.rds.amazonaws.com',
  user: 'postgres',
  password:'210201eE',
  port:5432,
  ssl: {
    rejectUnauthorized: false
}
})
// postgresql amazon servisindeki konuma bağlanan kısım
postgresConnection.connect(error => {
    if(error){
        console.log("no connection , error ",error.stack)
    }else{
        console.log("success")
    }
})

// parametre almadan sadece basit bir sql sorgusu çalışıtran fonksiyon
// örnek tablo oluştur sil vs.
function run_sql(sql_command){
    postgresConnection.query(sql_command, function(err, result){
        if(err){
            console.log('error at run_sql : ', err);
        }else{
            console.log("command run succesfully")
        }
    });
}

//run_sql("DROP TABLE login;")

// create login table
run_sql("CREATE TABLE IF NOT EXISTS login ( \
    user_no INT PRIMARY KEY, \
    mail TEXT, \
    password TEXT);")

//create user
let user_no = 1
let mail = "sonemre41@gmail.com"
let password = 1234

//create new login
run_sql(`INSERT INTO login VALUES ( '${user_no}','${mail}','${password}');`)

const rows = await postgresConnection.query('SELECT * FROM login');

// bir obje döndürür aradığımız tüm data burada
console.log("rows are here : ",rows )
// tüm satırları bir list halinde döndürür
console.log("rows are here : ",rows.rows )
// ilk satırdaki diction verisini döndürür
console.log("rows are here : ",rows.rows[0] )
// dictiondaki herhangi bir obje çekilmesi böyle yapılır
console.log("rows are here : ",rows.rows[0].user_no)

console.log("merhaba emre <3");