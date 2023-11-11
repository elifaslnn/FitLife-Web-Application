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

postgresConnection.connect(error => {
    if(error){
        console.log("no connection , error ",error.stack)
    }else{
        console.log("success")
    }
})

function run_sql(sql_command){
    postgresConnection.query(sql_command, function(err, result){
        if(err){
            console.log('error: ', err);
            process.exit(1);
        }else{
            console.log("command run sqccesfully")
        }
        process.exit(0);
    });
}

run_sql("CREATE TABLE IF NOT EXISTS login ();")
run_sql("DROP TABLE IF EXISTS login;")
run_sql("DROP TABLE IF EXISTS LogIn;")
run_sql("DROP TABLE IF EXISTS users;")


console.log("merhaba emre <3");