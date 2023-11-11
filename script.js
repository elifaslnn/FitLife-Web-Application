import { Pool } from 'pg'
 
const postgresConnection = new Pool({
  host: 'fitlife.covtsuyb4can.eu-north-1.rds.amazonaws.com',
  user: 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})



console.log("merhaba emre <3");
