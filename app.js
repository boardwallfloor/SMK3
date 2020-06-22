var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session')
const cors = require('cors');
require('dotenv').config();

const initiliazePassport = require('./config/passport')

//Routes
var authRoutes = require('./routes/auth');
var userRoutes = require('./routes/userRoutes');
var formRoutes = require('./routes/formRoutes');



//Mongo
const MongoDB = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-l7zho.mongodb.net/test?retryWrites=true&w=majority`;
mongoose.connect(MongoDB, {useUnifiedTopology : true, useNewUrlParser: true});
const db = mongoose.connection;
db.on('error',console.error.bind(console, 'Mongo connection ERROR : '));

//Middleware
var app = express();
const corsOptions = {
  origin: ['http://localhost:3000','192.168.100.62:3000'],
  exposedHeaders: ['Content-Range'],
}
app.use(cors(corsOptions))

initiliazePassport(passport);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
	secret: `${process.env.SS_SECRET}`,
	resave: false,
	saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());


//Routes Middleware
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/form', formRoutes);

console.log("Server running at port 9000");

//TEST
//For Development Only
const testRoutes = require('./routes/testRoutes')
app.use('/test',testRoutes);

module.exports = app;