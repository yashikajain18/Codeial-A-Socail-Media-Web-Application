const express =require('express');
const cookieParser = require('cookie-parser');
const app = express();
const port =8000;
const expressLayouts = require('express-ejs-layouts');
const db =require('./config/mongoose');

// used for session cookie
const session = require('express-session');
const passport=require('passport');
const passportLocal =require('./config/passport-local-strategy');
const passportJWT=require('./config/passport-jwt-strategy');
const passortGoogle =require('./config/passport_google-oauth2-strategy');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware=require('./config/middleware');

app.use(sassMiddleware({
   src: './assets/scss',
   dest: './assets/css',
   debug: true,
   outputStyle: 'extended',
   prefix: '/css'
}));

app.use(express.urlencoded());

app.use(cookieParser());

app.use(express.static('./assets'));

// make the uploads path available to browser
app.use('/uploads', express.static(__dirname + '/uploads'));

//use express layout 
app.use(expressLayouts);

// extract style and scripts from subpages into layout 
app.set('layout extractStyles', true);
app.set('layout extractScripts', true)


//use express router
//app.use('/', require('./routes'));

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store session cookie in the db
app.use(session({
   name: 'codeial',
   //TODO change the sceret before deployment in production mode
   secret: 'blahsomething',
   saveUninitialized: false,
   resave: false,
   cookie: {
      maxAge: (1000*60*100)
   },
   store:  MongoStore.create(
      {
         //mongooseConnection: db,
         client: db.getClient(),
         autoRemove: 'disabled'
      },
      function(err){
         console.log(err || 'connect-mongodb setup ok');
      }
   )

}));

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());

app.use(customMware.setFlash);

//use express router
app.use('/', require('./routes'));


app.listen(port, function(err){
     if(err){
        //  console.log(err);
        console.log(`Error in running the server: ${err}`);
     }
     console.log(`Server is running on port: ${port}`);
});