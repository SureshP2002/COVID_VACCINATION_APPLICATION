//importing express module
const express=require('express');

//for routing importing Router
const router=express.Router();

//importing mysql module
const mysql=require('mysql');

//import connection from databaseConnection
const dbConnect=require('./databaseConnection');


//routing to index page 
router.get('/',(req,res)=>{
    res.render('index',{title:"Home"});
});

//routing to covid page where the user can see the general information regarding covid virus and its awareness
router.get('/covid',(req,res)=>{
    res.render('covid',{title:"Covid info"});
});


//routing to vaccination_centre page where the user can see list of vaccination_centres with ist detailed address and dosage details
router.get('/vaccination_center',(req,res)=>{
   dbConnect.getConnection((err,connection)=>{
    if(err)
    throw err;
    connection.query("select * from vaccination_centres",(err,rows)=>{
        connection.release();
        if(err)throw err;
        else res.render('vaccination_center',{rows});
    })
   })
});


//user login page
router.get('/login',(req,res)=>{
if(req.query.id==1)
  {
    const message="Password dose not match"
    res.render('login',{message:message});
  }
  else if(req.query.id==2)
  {
    const message="UserName done not match"
    res.render('login',{message:message});
  }
    else if(req.query.id==undefined){
    res.render('login',{title:"Login"});
    }
});
//user login page authentication
router.post('/login',(req,res)=>{
    let user=req.body.username;
    let pass=req.body.password;

    dbConnect.getConnection((err,connection)=>{
        if(err)throw err;
        else
        {
            connection.query("select count(*) as count from user where Pass=?",[pass],(err,row)=>{
                if(err)throw err;
                else
                {
                    if(row[0].count>0)
                    {
                       connection.query("select user_name  from user where Pass=?",[pass],(err,rows)=>{
                        if(err)throw err
                        else
                        {
                            if(rows[0].user_name.toLowerCase()===user.toLowerCase())
                            {
                                connection.query("select centre_name,district,covishield,covaxin from vaccination_centres",(err,row1)=>{
                                    if(err)throw err;
                                    else
                                    {
                                      connection.release();
                                      res.render('registration',{title:"Registration",row1})
                                    }
                                  })
                            }
                            else
                            {
                                connection.release();
                                res.redirect('/login/?id=2');
                            }
                        }
                       })
                    }
                    else{
                        connection.release();
                        res.redirect('/login/?id=1');
                    }
                }
            })
        }
    })
})

//user sign up page
router.get('/signup',(req,res)=>{
if(req.query.id==1)
  {
    const message="Password already taken Change password"
    res.render('signup',{message:message});
  }
  else if(req.query.id==2)
  {
    const message="Adhar_number already exits"
    res.render('signup',{message:message});
  }
  else if(req.query.id==undefined){
    res.render('signup',{title:"Sign Up"});
  }
})

//user sign up process  and authentication and routes to vaccine registration page
router.post('/signup',(req,res)=>{
    let name=req.body.username;
    let adhar=req.body.Aadhar_number;
    let phone_number=req.body.phn;
    let pass=req.body.password;
    let email=req.body.email;
    dbConnect.getConnection((err,connection)=>{
        if(err)throw err;
        else 
        {
            connection.query("select count(*) as count from user where Pass=?",[pass],(err,row)=>{
                if(err)throw err;
                if(row[0].count==0)
                {
                    
                    connection.query("select count(*) as cnt from user where adhar=?",[adhar],(err,row2)=>{
                        if(err)throw err;
                        else
                        {
                            if(row2[0].cnt>0)
                            {

                                connection.release();
                                res.redirect('/signup/?id=2')
                            }
                            else{
                                 connection.query(`insert into user(user_name,phone,adhar,Pass,email) values(?,?,?,?,?)`,[name,phone_number,adhar,pass,email],(err,row3)=>{
                                  
                                  if(err)throw err;
                                  else
                                  {
                                    connection.query("select centre_name,district,covishield,covaxin from vaccination_centres",(err,row1)=>{
                                        if(err)throw err;
                                        else
                                        {
                                          connection.release();
                                          res.render('registration',{title:"Registration",row1})
                                        }
                                      })
                                  }
                                }) 
                            }
                        }
                    })

                }
                else 
                {
                    connection.release();
                    res.redirect('/signup/?id=1');
                }
            })
        }
    })
})



//storing the vaccine registration details of the user in the db
router.post('/register',(req,res)=>{
   let name=req.body.name;
    let Age=req.body.Age;
    let adhar=req.body.adhar;
    let phone=req.body.phone;
    let centre=req.body.centre;
    let vaccine=req.body.vaccine;

    let dose=req.body.dose;
    dbConnect.getConnection((err,connection)=>{
        if(err)throw err;
        else
        {
            connection.query("select covishield,covaxin from vaccination_centres where centre_name=?",[centre],(err,rows)=>{
                 
                  if(rows.length==0)
                  {
                    connection.release();
                    res.redirect('/reg/?id=3');
                  }
                
                
                else if(err)
                {
                  throw err;
                }
                else

                {
                  
                  
                    if(vaccine==="Covishield")
                    {
                       if(rows[0].covishield==0)
                       {
                        connection.release();
                        res.redirect('/reg/?id=1');
                       }
                       else
                       {
                        connection.query("update vaccination_centres set covishield=? where centre_name=?",[rows[0].covishield-1,centre],(err,row1)=>{
                            if(err)throw err;
                            else
                            {
                               connection.query("insert into registration(name,age,adhar,phone,centre,vaccine,dose) values(?,?,?,?,?,?,?)",[name,Age,adhar,phone,centre,vaccine,dose],(err,row2)=>{
                                connection.release();
                                if(err)throw err;
                                else{
                                   res.redirect('/reg/?id=2');
                                }
                               })
                            }
                        })
                       }
                    }
                    else{
                        if(rows[0].covaxin==0)
                       {
                        connection.release();
                        res.redirect('/reg/?id=1');
                       }
                       else
                       {
                        
                        connection.query("update vaccination_centres set covaxin=? where centre_name=?",[rows[0].covaxin-1,centre],(err,a)=>{
                            if(err)throw err;
                            else
                            {
                               connection.query("insert into registration(name,age,adhar,phone,centre,vaccine,dose) values(?,?,?,?,?,?,?)",[name,Age,adhar,phone,centre,vaccine,dose],(err,b)=>{
                                connection.release();
                                if(err)throw err;
                                else{
                                   res.redirect('/reg/?id=2');
                                }
                               })
                            }
                        })
                       }
                    }
                }
            })
        }
    })

})
//by applying business logic ,as per statistics only 10 slots alloted per day for each centre.Alerting when the user stock is empty or gives invalid centre name
router.get('/reg',(req,res)=>{
    if(req.query.id>0)
    {
        let message="";
    if(req.query.id==1){
       message="Vaccine Stock not available"
    }
    else if(req.query.id==2){
        message="Registration Succesfull"
    }
    else if(req.query.id==3)
    {
      message="Please Enter available centre";
    }


    dbConnect.getConnection((err,connection)=>{
        if(err)throw err;
              else
              {
                connection.query("select centre_name,district,covishield,covaxin from vaccination_centres",(err,row1)=>{
                  connection.release();
                    if(err)throw err;
                    else
                    {
                     
                      res.render('registration',{title:"Registration",row1,message:message})
                    }
                  })
              }

})
    }
   
})
//routing to vaccine registration page
router.get('/regist',(req,res)=>{
  dbConnect.getConnection((err,connection)=>{
    if(err)throw err;
    else
    {
      connection.query("select centre_name,district,covishield,covaxin from vaccination_centres",(err,row1)=>{
        connection.release();
          if(err)throw err;
          else
          {
           
            res.render('registration',{title:"Registration",row1})
          }
        })

    }
  })
})



//routing to admin login page
router.get('/admin-login',(req,res)=>{
    if(req.query.id==1)
    {
      const message="Enter Valid Id and Password"
      res.render('adminlogin',{message:message});
    }
    else{
    res.render('adminlogin',{title:"Admin Login"});
    }
})

//admin login authentication 
router.post('/adminpage',(req,res)=>{
    let name=req.body.username;
    let password=req.body.password;
  
    dbConnect.getConnection((err,connection)=>{
        if(err)throw err;
        else
        {
            connection.query("select * from admin",(err,row)=>{
                if(err)throw err;
                else{
                  
                    let status=0;
                    for(let i=0;i<row.length;i++)
                    {
                        if(row[i].admin_pas.toLowerCase()===password.toLowerCase()&&row[i].admin_name===name)
                        {
                           status=1;
                            break;
                        }
                    }
                   if(status==1)
                   {
                   
                    connection.release();
                    res.render('admindashboard',{title:"AdminDashBoard"});
                    
                   }
                   else{
                    connection.release()
                    res.redirect('/admin-login/?id=1');
                   }
                }
            })
        }
    })
   
})

//routing to admindashboard page
router.get('/adm',(req,res)=>{
    res.render('admindashboard',{title:"AdminDashBoard"});
})
//routing to vaccination_centre page for admin use
router.get('/vacci',(req,res)=>{
    dbConnect.getConnection((err,connection)=>{
        if(err)throw err;
        else{
           
            connection.query("select * from vaccination_centres",(err,rows)=>{
                connection.release();
                if(err)throw err;

                else{
                    
                    res.render('vaccicentres',{title:"CENTRES",rows});
                }
            })
        }
    })
})

//user registration details for admin reference
router.get('/details',(req,res)=>{
dbConnect.getConnection((err,connection)=>{
    if(err)throw err;
    else
    {
        connection.query("select * from registration order by centre asc",(err,rows)=>{
            connection.release();
         
            if(err)throw err;
            else
            {
             
             res.render('details',{title:"DETAILS",rows})   
            }
        })
    }
})
})

//deleting the registered user information once they get vaccinated
router.get('/dltuser',(req,res)=>{
  let id=req.query.id;
  dbConnect.getConnection((err,connection)=>{
    if(err)throw err;
    else{
      connection.query("delete from registration where id=?",[id],(err,row)=>{
        connection.release();
     if(err)throw err;
     else{
      res.redirect('/details');
     }
      })
    }
  })
})

//deleting the vaccination centre
router.get('/dltcentre',(req,res)=>{

 
    dbConnect.getConnection((err,connection)=>{
      let id=req.query.id;
  
      if(err)throw err;
      else{
        connection.query(`delete from vaccination_centres where centre_id=${id}`,(err,rows)=>{
          connection.release();
          if(err)throw err;
          else{
            res.redirect('/vacci');
          }
        })
      }
    })
  })

  //adding new vaccination centre detials page
  router.use('/addcentre',(req,res)=>{
    res.render('addcentre',{title:"ADD ITEM"})
  
  })

  //added to database 
  router.use('/added',(req,res)=>{
    let name=req.body.name;
    let address=req.body.address;
    let district=req.body.district;
    let work=req.body.worktime;
    let covishield=req.body.covishield;
    let covaxin=req.body.covaxin;
    //console.log(name,address,district,work,covaxin);
    dbConnect.getConnection((err,connection)=>{
    if(err)throw err;
      else{
        //console.log(name,address,district,work,covaxin);
        connection.query(`insert into vaccination_centres(centre_name,address,district,working_hours,covishield,covaxin) values(?,?,?,?,?,?)`,[name,address,district,work,covishield,covaxin],(err,rows)=>{
          connection.release();
          if(err)throw err;
          else
          {
            res.redirect('/vacci')

          }
        })
      }
    })
  })
//updating the vaccination_centre details if any changes
  router.use('/uptcentre',(req,res)=>{
    dbConnect.getConnection((err,connection)=>{
     let id=req.query.id;
     if(err)throw err;
     connection.query(`select * from vaccination_centres where centre_id=${id}`,(err,rows)=>{
       connection.release();
       if(err)throw err;
       else{
    
         res.render('updatecentre',{title:"UPDATE",rows})
       }
   
     })
    })
   })
  //storing the updated details
   router.use('/updated',(req,res)=>{
 
    dbConnect.getConnection((err,connection)=>{
        let id=req.body.id;
        let name=req.body.name;
        let address=req.body.address;
        let district=req.body.district;
        let work=req.body.worktime;
        let covishield=req.body.covishield;
        let covaxin=req.body.covaxin;
      
      if(err)throw err;
      else{
        connection.query(`update vaccination_centres set centre_name=?,address=?,district=?,working_hours=?,covishield=?,covaxin=? where centre_id=${id}`,[name,address,district,work,covishield,covaxin],(err,rows)=>{
          connection.release()
          if(err)throw err;
          else
          {
            
             res.redirect('/vacci')
          }
        })
      }
    })
    
  })

module.exports=router;