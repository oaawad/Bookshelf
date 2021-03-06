//Require Dependences
const express = require('express');
const path = require('path')
const session = require('express-session')
const engine = require('ejs-mate')
const flash = require('connect-flash');
const router = express.Router();
const methodOverride = require('method-override');

//Require utils
const { isLoggedIn , isNotLoggedIn, isAdmin} = require('./utils/middleware');
const mongoConnect = require('./utils/mongoConnect')
const catchAsync = require('./utils/catchAsync')
const ExpressError = require('./utils/ExpressError')

//Require Routes
const books = require('./routes/books');
const reviews = require('./routes/reviews');
const lists = require('./routes/lists');
const profile = require('./routes/profile');


const sessionConfig ={
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:  1000 * 60 * 60 * 24 * 7
    }
}

const app = express();
const db = mongoConnect();


app.engine('ejs',engine)
app.set('view engine','ejs')
app.set('views',path.join(__dirname, 'views'))

app.use(session(sessionConfig))
app.use(flash())
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use((req,res,next)=>{
    res.locals.currentUser = req.session.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})
app.get('/admin',isAdmin,(req,res) => {
    res.render('admin')
})
app.use('/books',books)
app.use('/books/:isbn/reviews',reviews)
app.use('/',lists)
app.use('/',profile)


app.all('*',(req,res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
   // Mongo Duplicate Keys errors  in Registering 
    if(err.code && err.code === 11000 ){
        if(err.keyPattern.username){
            req.flash('error',`This username "${err.keyValue.username}" is already used`)
            res.redirect('/register')
        } else if (err.keyPattern.email){
            req.flash('error',`This email is already used`)
            res.redirect('/register')
        }
    }

    res.status(statusCode).render('error', { err })
})

app.listen(3000,() =>{
    console.log(`Server is up on Port 3000`)
})