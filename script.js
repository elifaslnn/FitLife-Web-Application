import pg from 'pg'
 
const postgresConnection = new pg.Pool({
  host: 'fitlife.covtsuyb4can.eu-north-1.rds.amazonaws.com',
  user: 'postgres',
  password:'210201eE',
  port:5432,
  ssl: {
    rejectUnauthorized: false
}
})
postgresConnection.connect(error => {
    if(error){
        console.log("no connection , error ",error.stack)
    }else{
        console.log("success")
    }
})



console.log("merhaba emre <3");