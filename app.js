const express = require("express"); // call the express module which is default provded by Node


const app = express(); // now we need to declare our app which is the envoked express application
app.set('view engine','ejs');// Set the template engine 

const multer = require('multer');
const ejs = require('ejs');
const path = require('path');

const session = require('express-session');


// EJS
app.set('view engine', 'ejs');

//Set Static Folders
app.use(express.static('./public'));//Access to public folder
// app.use(express.static('public'));
app.use(express.static("views")); // Allow access to views folder
app.use(express.static("style")); // Allow access to styling folder
app.use(express.static("images")); // Allow access to images


const mysql = require('mysql');

// body parser to get information
const fs = require('fs')
const bodyParser = require("body-parser") // Call body parser modul and make use of it
app.use(bodyParser.urlencoded({extended:true}));


// required for passport 
app.use(session({
    secret: 'secretdatakeythatyoucanchange', 
    resave: true,
    saveUninitialized: true
} )); // session secret

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const localStorage = require('node-localstorage');
const expressValidator = require('express-validator');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const bcrypt = require('bcrypt-nodejs');



app.use(express.urlencoded({extended:false}));// body parser to get information
//app.use(bodyParser.json());
app.use(cookieParser()); // read cookies (needed for auth)

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

//express validator middleware
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.')
//         , root = namespace.shift()
//         , formParam = root;
//         while(namespace.length) {
//             formParam +='[' + namespace.shift()+']';
//         }
        
//         return {
//             param: formParam,
//             msg : msg,
//             value: value
//         }
//     }
// }))

// Express message middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });


// *****************************************Start of SQL *******************************************

const connection = mysql.createConnection({
    host: 'den1.mysql6.gear.host',
    user: 'photodb',
    password: 'Ps13eXh-~aB9',
    database: 'photodb'
});

//Next we need to create a connectin to the database
connection.connect((err) =>{
     if(err){
        console.log("go back and check the connection details. Something is wrong.");
        // throw(err)
    } 
     else{
        console.log('Looking good the database connected');
    }
});

connection.on('error', function(err) {
  console.log(err.code);
});

setInterval(function () {
    connection.query('SELECT 1');
}, 5000);


//CREATE TABLE paint Id author, title, image_url, price, size
// app.get('/createimages', function(req, res){
// let sql = 'CREATE TABLE paint (Id int NOT NULL AUTO_INCREMENT PRIMARY KEY, author varchar(255),title varchar(255),price int, size varchar(255),activity varchar(255), image_url varchar(255))';
// let query = connection.query(sql, (err,res) => { 
//     if(err) throw err;
// });
//   res.send("SQL Worked"); 
//     console.log("Paint table exists!!!");
// });






//****************************************  Pages ******************************
// set up front page using the request and response function
app.get('/', function(req, res) {
res.render("index"); // we set the response to send back the string hello world
console.log("Hello World"); // used to output activity in the console
});


// URL to get products page
app.get('/products', function(req,res){
    // Select a table call paint which is hold all images details
  let sql = 'SELECT * FROM paint'
  let query = connection.query(sql, (err,result) => { 
      if(err) throw err;
  res.render('products', {result});
  console.log(result)
});
console.log("Product gallery displayed");
});


//URL to get the product ID
app.get('/product/:id', function(req,res){
  let sql = 'SELECT * FROM paint WHERE Id = "'+req.params.id+'" ; ';
  let query = connection.query(sql, (err,result) => { 
      if(err) throw err;
  console.log(result);
  res.render('product', {result})
  });
});
// URL to get the event page
app.get('/event', function(req,res){
        res.render('event');
        console.log("event page has been displayed")
});

// URL to get the payment page
app.get('/payment', function(req,res){
        res.render('payment');
        console.log("payment page has been displayed")
    
});

// URL to get checkout page
app.get('/checkout', function(req,res){
    // Select a table call paint which is hold all images details
  let sql = 'SELECT * FROM paint'
  let query = connection.query(sql, (err,result) => { 
      if(err) throw err;
  res.render('checkout', {result});
  console.log(result)
});
console.log("Checkout gallery displayed");
});


app.get("*", function(req, res, next) {
    res.locals.cart = req.session.cart;
    next();
})


// URL to get the cart page
app.get('/cart', function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
  let sql = 'SELECT * FROM cartitem'
  let query = connection.query(sql, (err,result) => { 
      if(err) throw err;
  res.render('cart', {result});
  console.log(result)
});
console.log("You are in cart section");
});

//URL to add to cart
app.get('/cart/:id', function(req,res){
    // Create a table that will show product Id, title, price, image and sporting activity
  let sql = 'SELECT * FROM paint WHERE Id = "'+req.params.id+'" ; ';
  let query = connection.query(sql, (err,result) => { 
      
      if(err) throw err;
 
  console.log(req.session.cart);
  
  req.flash("success", "Product added")
  res.render('cart', {result})
  });
})


/**************************************cart****************************************/
  // Add to cart
  
  
//     insertCart(res, productId, userId)
//     {
//         this.connection.query("insert into shoppingcart set userid=?,productid=?", [userId, productId],
//             function (err,result) {
//                 if(err)
//                 {
//                     console.log("Add to cart failed");
//                     res.send("0");
//                 }
//                 else
//                 {
//                     console.log("Add to cart successful");
//                     res.send("1");

//                 }
//             })
//     }

// app.post('/addCart', function(req,res,next){
// //   var conn = new Database();
//   var productId = req.body.paintid;
//   var user = req.session.userid;
//   console.log(user);
//   if(user)
//   {
//       connection.insertCart(res,productId,user);
//   }
//   else
//   {
//       res.redirect('/login');
//   }

// });



// URL to get Image Upload page
app.get('/upload',checkAuthenticated, (req, res) => res.render('upload'));

//***************************************************Upload file*******************************************
//Set The Storage Engine
const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: function(req, file, cb){
    cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Init Upload
const upload = multer({
  storage: storage,
  limits:{fileSize: 1000000},
  fileFilter: function(req, file, cb){
    checkFileType(file, cb);
  }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
  // Allowed ext
  const filetypes = /jpeg|jpg|png|gif/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime
  const mimetype = filetypes.test(file.mimetype);

  if(mimetype && extname){
    return cb(null,true);
  } else {
    cb('Error: Images Only!');
  }
}



app.post('/upload', (req, res) => {
  upload(req, res, (err) => {
    if(err){
      res.render('upload', {
        msg: err
      });
    } else {
      if(req.file == undefined){
        res.render('upload', {
          msg: 'Error: No File Selected!'
        });
      } else {
        res.render('upload', {
          msg: 'File Uploaded!Pending for approval',
          file: `uploads/${req.file.filename}`
        });
      }
    }
  });
});



//**************************End of SQL ******************************



// --------------------------------------------------------- Authenthication ------------------------------------------------------------ //

// =====================================
// LOGIN ===============================
// =====================================
// show the login form
app.get('/login',checkNotAuthenticated,function(req, res) {

	// render the page and pass in any flash data if it exists
	res.render('login.ejs', { message: req.flash('loginMessage') });
});

// process the login form
app.post('/login',checkNotAuthenticated, passport.authenticate('local-login', {
        successRedirect : '/dashboard', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
	}),
    function(req, res) {
        console.log("hello");

        if (req.body.remember) {
          req.session.cookie.maxAge = 1000 * 60 * 60;
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
            connection.query("SELECT * FROM users WHERE email = ?",[username], function(err, rows){
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
	app.get('/register', checkNotAuthenticated,function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('register.ejs', { message: req.flash('signupMessage') });
	});

// process the signup form
app.post('/register', checkNotAuthenticated,passport.authenticate('local-signup', {
        successRedirect : '/dashboard', // redirect to the secure profile section 
        failureRedirect : '/register', // redirect back to the signup page if there is an error 
        failureFlash : true // allow flash messages
}));



// URL to get the dashboard page
app.get('/dashboard',checkAuthenticated, function(req,res){
    // Create a table that will show product Id, name, price, image and sporting activity
  
        res.render('dashboard',{ name: req.user.username});
        console.log("dashboard page has been displayed")
    
});
// =====================================
// PROFILE SECTION =========================
// =====================================
// we will want this protected so you have to be logged in to visit
// we will use route middleware to verify this (the isLoggedIn function)
app.get('/profile',checkAuthenticated, function(req, res) {
	res.render('profile', {
		user : req.user // get the user out of session and pass to template
	});
});

// Edit Profile
app.get('/editprofile/:id', function(req, res){
    let sql = 'SELECT * FROM users WHERE Id = "'+req.params.id+'" ';
    let query = connection.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    res.render('editprofile', {result}); // This will render the edit profile page for us
  });
    console.log("Edit profile worked");
});

// ***** Post new data to database
app.post('/editprofile/:id', function(req, res){
    let sql = 'UPDATE users SET username = "'+req.body.username+'", email = "'+req.body.email+'", password = "'+req.body.password+'" WHERE Id = "'+req.params.id+'"';
    let query = connection.query(sql, (err, result) => {
    if(err) throw err;
    console.log(result);
    console.log(result.affectedRows + " record(s) updated");
  });
  res.redirect("/profile");
  });

// =====================================
// LOGOUT ==============================
// =====================================
app.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});


function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/dashboard')
  }
  next()
}

function checkAuthenticated(req, res, next) {
// if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
    return next()
  }
  // if they aren't, redirect them to the login page
  res.redirect('/login')
}


app.get('/alter', function(req, res){
let sql = 'ALTER TABLE users ADD COLUMN admin BOOLEAN DEFAULT FALSE;'
let query = connection.query(sql, (err, res) => { if(err) throw err;
console.log(res);
}); res.send("altered"); });


// function isAdmin(req, res, next) {
//     //if user is authenticated i the session, carry on
//     if(req.user.admin)
//     return next();
    
//     //if thery aren't redirect them to the login page
//     res.redirect('/login');
    
    
    
    
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

   connection.query("SELECT * FROM users WHERE Id = ? ",[Id], function(err, rows){
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
        connection.query("SELECT * FROM users WHERE username = ?",[username], function(err, rows) {
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

                connection.query(insertQuery,[newUserMysql.username, newUserMysql.email, newUserMysql.password],function(err, rows) {
                    newUserMysql.Id = rows.insertId;

                    return done(null, newUserMysql);
                });
            }
        });
    })
);



// ******************************************From here is JSON data , contatc us form********************************
var contact = require("./model/contact.json");

app.get('/contacts', function(req,res){
    res.render("contacts", {contact}); //Get the contacts page when somebody visits the /contacts url
    console.log("contacts page has been displayed");
});

// Get the contact us page
app.get('/contactform', function(req, res) {
res.render("contactform"); // we set the response to send back the string I found the contact us page
console.log("I found the contact us page"); // used to output activity in the console
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
        name: req.body.name,
        comment: req.body.comment,
        email: req.body.email
        
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
    
    res.redirect('/contacts');
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
    
    // the next three lines get the content from the body where the user fills in the form 
    var z = parseInt(req.params.id);
    var x = req.body.name   
    var y = req.body.comment
    // The next section pushes the new data into the json file in place of the data to be updated
    contact.splice(index, 1, {name: x, comment: y, email: req.body.email, id: z })
    
    
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


// this code provides the server port for our application to run on
app.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
console.log("Yippee its running");

});
