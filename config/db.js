const mysql = require('mysql2');


const pool = mysql.createPool({
  host: 'ucka.veleri.hr',       
  user: 'mlakovic',            
  password: '11',            
  database: 'mlakovic'     
});


module.exports = pool.promise();
