var express = require("express"); // call the express module which is default provded by Node
var app = express(); // now we need to declare our app which is the envoked express application
var mysql = require('mysql');

app.set('view engine','ejs');//set template engine ejs
app.use(express.urlencoded({extended:false}));

var fileUpload = require('express-fileupload');

app.use(fileUpload());

// body parser to get information
var fs = require('fs')
var bodyParser = require("body-parser") // Call body parser modul and make use of it
app.use(bodyParser.urlencoded({extended:true}));


var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var localStorage = require('node-localstorage');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');
app.use(cookieParser()); // read cookies (needed for auth)



//Set Static Folder
app.use(express.static("views")); // Allow access to views folder
app.use(express.static("style")); // Allow access to styling folder
app.use(express.static("images")); // Allow access to images



// required for passport 
app.use(session({
    secret: 'secretdatakeythatyoucanchange', 
    resave: true,
    saveUninitialized: true
} )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// *****************************************Start of SQL **********************************

const db = mysql.createConnection({
    host: 'den1.mysql6.gear.host',
    user: 'photodb',
    password: 'Ps13eXh-~aB9',
    database: 'photodb'
});
// Next we need to create a connectin to the database

db.connect((err) =>{
     if(err){
        // console.log("go back and check the connection details. Something is wrong.")
        // console.log('caught this error: ' + err.toString());
        throw(err)
    } 
     else{
        
        console.log('Looking good the database connected')
    }
    
})

// db.connect(db, {useNewUrlParser: true})
// .then(()=> console.log('Looking good the database connected'))
// .catch(err => console.log(err));


//the following code to connection pool and handling disconnect
// setInterval(function () {
//     db.query('SELECT 1');
// }, 3000);

//Drop Table
// db.connect(function(err) {
//   if (err) throw err;
//   var sql = "DROP TABLE paint";
//   db.query(sql, function (err, result) {
//     if (err) throw err;
//     console.log("Table deleted");
//   });
// });



// CREATE TABLE users Id username, email, password
app.get('/createusers', function(req, res){
let sql = 'CREATE TABLE users (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, username varchar(255), email varchar(255), password varchar(255));'
let query = db.query(sql, (err,res) => { if(err) throw err;
});
res.send("SQL Worked"); 
    console.log("sqllllllll");
});

// CREATE TABLE paint Id author, title, image_url, price, size
app.get('/createimages', function(req, res){
let sql = 'CREATE TABLE paint (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, author varchar(255),title varchar(255),price int, size varchar(255),activity varchar(255), image_url varchar(255))';
let query = db.query(sql, (err,res) => { 
    if(err) throw err;
});
 res.send("SQL Worked"); 
    console.log("to see if paint table exists");
});

app.get('/make', function(req, res){
let sql = 'INSERT INTO paint (author, title, price, size, activity, image_url) values ?';
 let   values =[
    
    ["Ann Talor", "Sun Orange", 15, "1500x1200px","The image was took on Dublin","sun.jpg"],
    ["Peter Dawn", "Flowers", 25, "4896×3060px","The image was took on gardan","flower.jpg"],
    ["Amy Talor", "Scenes", 32, "3643×5468px","The image was took on site","scene.jpg"],
    ["Hannah Ryan", "Mountain", 15, "1500x1200px","The image was took on Wicklow","mountain.jpg"],
    ["Michael Doe", "Traval", 15, "3630×5445px","The image was took on Galway","traval.jpg"],
    ["Sandy Lee", "Tree", 17, "1500x1200px","The image was took on Limrick","tree.jpg"],
    ["Betty Zen", "Desert", 39, "6600×5100px","The image was took on Desert","desert.jpg"],
    ["Richard Ryan", "Snow", 15, "4000×6000px","The image was took on Canada","snow.jpg"],
    ["Susan Howard", "House", 8, "1280×853px","The image was took on Sligo","house.jpg"],
    ["Vicky Lee", "Sun Rise", 15, "1500x1200px","The image was took on Meath","sunrise.jpg"],
    ["Ben Fox", "Sea", 158, "1700x1500px","The image was took on Malahide","sea.jpg"],
    ["William Talor", "Plant", 12, "1500x1200px","The image was took on backyard","plant.jpg"],
    ["Sara Yo", "Forst", 28, "5184×3456px","The image was took on Belfast","forst.jpg"]
    
    ];
    
let query = db.query(sql,[values], (err,res) => { if(err) throw err;
});
res.send("SQL Worked"); 
    console.log("Number of values inserted: " + res.affectedRows);
});



app.get('/product', function(req, res) {
res.render("product"); // we set the response to send back the string hello world
console.log("Single product page"); // used to output activity in the console
});

//URL to get the product ID
app.get('/product/:id', function(req,res){
    // Create a table that will show product Id, title, price, image and sporting activity
  let sql = 'SELECT * FROM paint WHERE Id = "'+req.params.id+'" ; ';
  let query = db.query(sql, (err,result) => { 
      
      if(err) throw err;
  
 
  console.log(result);
   res.render('product', {result})
  });
})

// URL to get the edit product page

app.get('/editproduct/:id', function(req,res){
    
    
    let sql = 'SELECT * FROM paint WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('editproduct', {result})
        
    });
    
    
})
    
 // URL to edit product
   
  app.post('/editproduct/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and description
    let sql = 'UPDATE paint SET title = "   '+req.body.title+'   ", price = '+req.body.price+', size = "'+req.body.size+'", activity = "'+req.body.activity+'", image = "'+req.body.image_url+'" WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/alluploadproducts')
    //res.send("You created your first Product")
    
}) 

app.get('/editprofile', function(req, res) {
	res.render('editprofile', {
		user : req.user // get the user out of session and pass to template
	});
});

// URL to get the edit product page

app.get('/editprofile/:id', function(req,res){
    
    
    let sql = 'SELECT * FROM users WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,result) => {
        
        if(err) throw err;
        
        console.log(result);
        
        res.render('editprofile', {result})
        
    });
    
    
})
    
 // URL to edit profile
   
  app.post('/editprofile/:id', function(req,res){
    // Create a table that will show product Id, name, price, image and description
    let sql = 'UPDATE users SET username = "   '+req.body.username+'   ", email = "'+req.body.email+'", password = "'+req.body.password+'" WHERE Id =  "'+req.params.id+'" ';
    
    let query = db.query(sql, (err,res) => {
        
        if(err) throw err;
        
        console.log(res);
        
    });
    
    res.redirect('/profile')
    //res.send("You created your first Product")
    
}) 
// URL to get the add product page
// app.get('/addproduct', function(req,res){
//     // Create a table that will show product Id, name, price, image and sporting activity
//   let sql = 'SELECT * FROM users'  
//   let query = db.query(sql, (err, res1) => {    
//       if(err) throw err;    
//       console.log(res1);
//   })
  
    
// })

// --------------------------------------------------------- Authenthication ------------------------------------------------------------ //

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
app.get('/login', function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('login.ejs', { message: req.flash('loginMessage') });
});

// process the login form
app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
	}),
    function(req, res) {
        console.log("hello");

        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 3;
        } else {
          req.session.cookie.expires = false;
        }
    res.redirect('/');
});

// =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================
    // we are using named strategies since we have one for login and one for signup
    // by default, if there was no name, it would just be called 'local'

    passport.use(
        'local-login',
        new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, username, password, done) { // callback with email and password from our form
            db.query("SELECT * FROM users WHERE email = ?",[username], function(err, rows){
                if (err)
                    return done(err);
                if (!rows.length) {
                    return done(null, false, req.flash('loginMessage', 'No user found with that email.')); // req.flash is the way to set flashdata using connect-flash
                }

                // if the user is found but the password is wrong
                if (!bcrypt.compareSync(password, rows[0].password))
                    return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.')); // create the loginMessage and save it to session as flashdata

                // all is well, return successful user
                return done(null, rows[0]);
            });
        })
    );
//};

// =====================================
// SIGNUP ==============================
// =====================================
// show the signup form
	app.get('/register', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('register.ejs', { message: req.flash('signupMessage') });
	});

// process the signup form
app.post('/register', passport.authenticate('local-signup', {
        successRedirect : '/dashboard', // redirect to the secure profile section 
        failureRedirect : '/register', // redirect back to the signup page if there is an error 
        failureFlash : true // allow flash messages
}));




// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/profile', function(req, res) {
	res.render('profile', {
		user : req.user // get the user out of session and pass to template
	});
});

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});

// route middleware to make sure
function isLoggedIn(req, res, next) {

	// if user is authenticated in the session, carry on
	if (req.isAuthenticated())
		return next();

	// if they aren't redirect them to the home page
	res.redirect('/');
}

// function isNotLoggedIn(req, res, next) {
//   if (req.isAuthenticated()) {
//     return res.redirect('/')
//   }
//   next()
// }

//module.exports = function(passport) {

// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
    done(null, user.Id); // Very important to ensure the case if the Id from your database table is the same as it is here
});

// used to deserialize the 
passport.deserializeUser(function(Id, done) {    // LOCAL SIGNUP ============================================================

   db.query("SELECT * FROM users WHERE Id = ? ",[Id], function(err, rows){
        done(err, rows[0]);
    });
});

// =========================================================================
// =========================================================================
// we are using named strategies since we have one for login and one for signup
// by default, if there was no name, it would just be called 'local'

passport.use(
    'local-signup',
    new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    },
    function(req, username, password, done) {
        // find a user whose email is the same as the forms email
        // we are checking to see if the user trying to login already exists
        db.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
            if (err)
                return done(err);
            if (rows.length) {
                return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
            } else {
                // if there is no user with that username
                // create the user
                var newUserMysql = {
                    username: username,
                    email: req.body.email,
                    password: bcrypt.hashSync(password, null, null)  // use the generateHash function in our user model
                };

                var insertQuery = "INSERT INTO users ( username, email, password ) values (?,?,?)";

                db.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password],function(err, rows) {
                    newUserMysql.Id = rows.insertId;

                    return done(null, newUserMysql);
                });
            }
        });
    })
);


//Modify the user table to add a Boolean for admin
// app.get('/alter', function(req, res){
//  let sql = 'ALTER TABLE users ADD COLUMN admin BOOLEAN DEFAULT FALSE;'
//   let query = db.query(sql, (err, res) => {
//     if(err) throw err;
//     console.log(res);
    
    
//   });
//   res.send("altered");
//   });
// see are they admin
// function isAdmin(req, res, next) {

// 	// if user is authenticated in the session, carry on
// 	if (req.user.admin)
// 		return next();

// 	// if they aren't redirect them to the home page
// 	res.redirect('/');
// }


//-----------------------------------------------Upload images and display on allupload images page-----------------------------------//
//The route to render the upload page
app.get('/upload', function(req, res){
  res.render('upload')  
});


// post request url
app.post('/upload', function(req, res){
    
 //    need to get the image from the form
 
 let sampleFile = req.files.sampleFile
  filename = sampleFile.name;
 // we use the middleware (file upload ) to move the data from the form to the desired location
    sampleFile.mv('./images/' + filename, function(err){
        if(err)
        return res.status(500).send(err);
        console.log("Image is " + req.files.sampleFile)
        res.redirect('/alluploadproducts');
    });
});


// app.get('/alluploadproducts', function(req, res){
//   res.render('alluploadproducts')  
// });

// // URL to get the product page
app.get('/alluploadproducts', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
  let sql = 'SELECT * FROM paint'
  let query = db.query(sql, (err,result) => { 
      
      if(err) throw err;
  
  res.render('alluploadproducts', {result});
  console.log(result)
});

console.log("You created you first product");

    
});

app.post('/alluploadproducts', function(req, res){
    
      /// Upload image also 
    if (!req.files)
    return res.status(400).send('No files were uploaded.');
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  filename = sampleFile.name;
  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv('./images/' + filename, function(err) {
    if (err)
      return res.status(500).send(err);
 console.log("Here is the image " + req.files.sampleFile)
    //res.redirect('/');
  });
    
    
let sql = 'INSERT INTO paint (title, price, size,activity, image) VALUES ("'+req.body.title+'", '+req.body.price+', '+req.body.size+', "'+req.body.activity+'","'+filename+'")'
     let query = db.query(sql, (err,res) => {
        if(err) throw err;
    });
    res.redirect("/alluploadproducts");
 
});


// // ******************************************From here is JSON data ********************************
var contact = require("./model/contact.json");

app.get('/contacts', function(req,res){
    res.render("contacts", {contact}); //Get the contacts page when somebody visits the /contacts url
    console.log("contacts page has been displayed");
});
app.get('/contactform', function(req,res){
    res.render("contactform"); //Get the contacts page when somebody visits the /contacts url
    console.log("contact form page has been displayed");
});

//post request to send JSON data to server
app.post("/contactform",function(req,res){
   
   //Step 1 is to find the largest id in the JSON file 
   function getMax(contacts, id){ // function is called getMax
   var max // the max variable is declared here but still unknown
   
    for (var i=0; i<contacts.length; i++){ // loop through the contacts in the json file as long as there are contacts to read
        
        if(!max || parseInt(contact[i][id])> parseInt(max[id]))
        max = contacts[i];
    }
    return max;
    
    }
    // make a new ID for the next item in the JSON file
     maxCid = getMax(contact,"id") // calls the getMax function from above and passes in parameters
    
    var newId = maxCid.id + 1; // add 1 to old largest to make new largest
    // show the result in the console
    console.log("new Id is " + newId)
    // we need to get access to what the user types in the form
    // and pass it to our JSON file as the new data
    
    var contactsx = {
        id: newId,
        fullname: req.body.fullname,
        email: req.body.email,
        phonenumber: req.body.phonenumber,
        message: req.body.message,
        
        
    }
    fs.readFile('./model/contact.json','utf8', function readfileCallback(err){
        if(err) {
            throw(err)
        } else {
            
            contact.push(contactsx); // add the new data to the JSON file
            json = JSON.stringify(contact, null, 4); // this line structures the JSON so it's easy on the eye
            fs.writeFile('./model/contact.json',json, 'utf8')
        }
    })
    
    res.redirect('/contactform');
    
    
});

// Now we code for the edit JSON date

// *** get page to edit 
app.get('/editcontact/:id', function(req,res){
    // Now we build the actual information based on the changes made by the user 
   function chooseContact(indOne){
       return indOne.id === parseInt(req.params.id)
       }


  var indOne = contact.filter(chooseContact)
    
   res.render('editcontact', {res:indOne}); 
    
});

// *** Perform the edit

 app.post('/editcontact/:id', function(req,res){
     
     //firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
     var json = JSON.stringify(contact)
     
     // declare the incoming id from the url as a variable
     var keyToFind = parseInt(req.params.id)
    
    // use predetermined JavaScript functionality to map the data and find the Information i need
    var index = contact.map(function(contact) {return contact.id}).indexOf(keyToFind)
    
    // the next Four lines get the content from the body where the user fills in the form 
    var z = parseInt(req.params.id);
    var a = req.body.fullname   
    var b = req.body.phonenumber
    var c = req.body.message
    // The next section pushes the new data into the json file in place of the data to be updated
    contact.splice(index, 1, {fullname: a, email: req.body.email, phonenumber: b, message: c, id: z })
    
    
    // Now we reformat the JSON and push it back to the actual file 
    json = JSON.stringify(contact, null, 4); // this line structures the JSON so it's easy on the eye
    fs.writeFile('./model/contact.json',json,'utf8',function(){})
    
    res.redirect("/contacts");
})


app.get ('/deletecontact/:id', function(req,res){
    
    
    
    // firstly we need to stringify our JSON data so it can be call as a variable an modified as needed
    var json = JSON.stringify(contact)
    
    // declare the incoming id from the url as a variable 
    var keyToFind = parseInt(req.params.id)
    
    // use predetermined JavaScript functionality to map the data and find the information I need 
    var index = contact.map(function(contact) {return contact.id}).indexOf(keyToFind)
    

    contact.splice(index, 1)
    
  
    
    // now we reformat the JSON and push it back to the actual file
    json = JSON.stringify(contact, null, 4); // this line structures the JSON so it is easy on the eye
    fs.writeFile('./model/contact.json',json, 'utf8', function(){})
    
    res.redirect("/contacts");
    
    
    
})




//--------------------------------URL to get Pages----------------------------------//

// set up simple hello world application using the request and response function
app.get('/',function(req, res) {
res.render("index"); // we set the response to send back the string hello world
console.log("Hello World"); // used to output activity in the console
});


// app.get('/products', function(req, res) {
// res.render("products"); // we set the response to send back the string hello world
// console.log("Displaying products page"); // used to output activity in the console
// });


app.get('/products', function(req,res){
    // Create a table that will show product Id, title, price, image and sporting activity
  let sql = 'SELECT * FROM paint WHERE Id = "'+req.params.id+'" ; ';
  let query = db.query(sql, (err,result) => { 
      
      if(err) throw err;
  
 
  console.log(result);
   res.render('products', {result})
  });
})

// URL to get the addproduct page
// app.get('/addproduct', function(req,res){
//     // Create a table that will show product Id, name, price, image and sporting activity
  
//         res.render('addproduct');
//         console.log("Add on products page has been displayed")
    
// });

// URL to get the product page
app.get('/event', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
  
        res.render('event');
        console.log("event page has been displayed")
    
});


// URL to get the dashboard page
app.get('/dashboard', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
  
        res.render('dashboard',{ name: req.user.username});
        console.log("dashboard page has been displayed")
    
});

// URL to get the payment page
app.get('/payment', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
  
        res.render('payment');
        console.log("payment page has been displayed")
    
});

// URL to get the payment page
app.get('/forgot', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
  
        res.render('forgot');
        console.log("forgot page has been displayed")
    
});


// app.get('/contacts',function(req, res){
//     res.render("contacts");//Get the contacts page when somebody visits the /contacts url
//     console.log("I found the contacts page");
// });

// this code provides the server port for our application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
console.log("Yippee its running");
  
});
