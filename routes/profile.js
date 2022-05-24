const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const profile = require('../controllers/profile');
const { isLoggedIn , isNotLoggedIn,validateUserReg,validateUserLogin} = require('../utils/middleware');

router.get('/', (req,res)=>{res.render('home')})                                   
router.get('/login', isLoggedIn, (req,res)=>{res.render('login')})              
router.get('/register', isLoggedIn, (req,res)=>{res.render('register')});  

router.post('/login' , isLoggedIn, validateUserLogin,catchAsync(profile.login));                                         
router.post('/register', isLoggedIn, validateUserReg, catchAsync(profile.register));  
router.get('/logout', isNotLoggedIn, profile.logout);

router.get('/:id');                               // Render User Profile   R
router.post('/:id');                              // Edit user profile     U
router.delete('/:id');                            // Delete user profile?  D


module.exports = router;