const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
var session = require('express-session')
const path = require('path');


// create express app
const app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

//use sessions for tracking logins
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false
}));

app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
});

app.use(express.static(path.join(__dirname, 'app/views')));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'app/views'))

// Require User routes
require('./app/routes/user.routes.js')(app);

// Require Articles routes
require('./app/routes/article.routes.js')(app);

// Configuring the email account
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '28.nitin@gmail.com',
    pass: 'nitinSvn@1234'
  }
});



// Configuring the database
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const Article = require('./app/models/article.model.js');

mongoose.Promise = global.Promise;

// Connecting to the database
mongoose.connect(dbConfig.url)
.then(() => {	
    console.log("Successfully connected to the database");    
}).catch(err => {
    console.log('Could not connect to the database. Exiting now...');
    process.exit();
});

// define a simple route
app.get('/', (req, res) => {
	res.render('index');
});

app.get('/articles', (req, res) => {
	res.render('articles', { 
		ResultData: null,
		message: null
	});	
});

app.get('/contact', (req, res) => {
	res.render('contact', { message: null })
});

app.get('/login', (req, res) => {
	res.render('login')
});

app.get('/signUp', (req, res) => {
	res.render('signUp', { ResultData: null  })
});

app.get('/addArticle', (req, res) => {
	res.render('addArticle')
});


app.get('/articleUpdatePage/:articleId', (req, res) => {
	Article.findById(req.params.articleId)
    .then(article => {
    	res.render('articleUpdatePage', { 
    		articleData: article
    	})
    }).catch(err=>{
    	console.log('Error Occurred')
    });
	
});


app.post("/contactProcess", (req, res) =>{
	
	var name = req.body.name;
	var email = req.body.email;
	var comment = req.body.comment;

	var mailOptions = {
		  from: 'nodeApp@mobikasa.com',
		  to: email,
		  subject: 'Thanks for contacting node-app',
		  html: 'Hi '+name+',<br>Thanks for contact us!<br>We will contact you soon on your query, as soon as possible.<br><br>Thanks,<br>Node App.'
		};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    res.render("contact", { message: 'error' })
	  } else {
	    res.render("contact", { message: 'sucess' })
	  }
	}); 

})


app.get('/appDocs', (req, res) => {
	res.render('api-docs');
});



// listen for requests
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});