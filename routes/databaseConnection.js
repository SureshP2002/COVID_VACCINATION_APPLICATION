//importing mysql module
const mysql=require('mysql');
//making connection
const con=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    port:'3306',
    password:'Suresh1304@',
    database:'covid'
});
/* //checking connection
con.getConnection((err,connection)=>{
    if(err)
    {
        throw err;
    }else{
        console.log('DB contected')
    }
}) */
module.exports=con;