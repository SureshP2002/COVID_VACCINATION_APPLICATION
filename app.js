//importing the user defined module from routes/home page
const homeRouter=require('./routes/home')

//import express mdoule
const express=require('express');
const app=express();

//importing the express-handlebars[template engines]
const exphbs=require('express-handlebars');
const handlebars=exphbs.create({extname:".hbs"});
app.engine('hbs',handlebars.engine);
app.set("view engine","hbs");

//import body parser module
const bodyparser=require('body-parser');
app.use(bodyparser.urlencoded({extended:true})); 



//for displaying [static] content
app.use(express.static('public'));






app.use("/",homeRouter);
app.listen(4001);