var express = require("express"); // call the express module which is default provded by Node

var app = express(); // now we need to declare our app which is the envoked express application
app.set('view engine','ejs');//set template engine ejs

app.use(express.static("views")); // Allow access to views folder
app.use(express.static("style")); // Allow access to styling folder
app.use(express.static("images")); // Allow access to images



// set up simple hello world application using the request and response function

app.get('/', function(req, res) {
res.render("index"); // we set the response to send back the string hello world
console.log("Hello World"); // used to output activity in the console
});

app.get('/contacts', function(req,res){
    res.render("contacts"); //Get the contacts page when somebody visits the /contacts url
    console.log("contacts page has been displayed");
});



// app.get('/contacts',function(req, res){
//     res.render("contacts");//Get the contacts page when somebody visits the /contacts url
//     console.log("I found the contacts page");
// });

// this code provides the server port for our application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
console.log("Yippee its running");
  
});
