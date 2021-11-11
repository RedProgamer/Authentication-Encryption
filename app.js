require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

app.use(bodyParser.urlencoded({ extended: true}));
app.set('view engine', 'ejs');
app.use(express.static('public'));

//setup mongodb using mongoose
mongoose.connect('mongodb://localhost:27017/userDB');

const Schema = new mongoose.Schema({
    email: String,
    password: String,
});

const secret = process.env.SECRET_KEY;
Schema.plugin(encrypt, { secret: secret, encryptedFields: ['password'] });

const User = mongoose.model('users', Schema);

app.get('/', (req, res) => {
    res.render("home")
});

app.get('/login', (req, res) => {
    res.render("login")
});

app.post('/login', (req, res)=> {
    const { email, password } = req.body;

    User.findOne({email: email}, function(err, result) {
        if(!err) {
            if(result.password === password) {
                console.log('Successfully Logged In');
                res.render("secrets");
            }
        }
    });
})

app.get('/register', (req, res) => {
    res.render("register")
});

app.post('/register', (req, res) => {
    const { email, password } = req.body;

    User.create({
        email: email,
        password: password
    }, function(err, result) {
        if(!err) {
            console.log('Added succesfully!');
            res.render("secrets");
        }else {
            console.error(err);
        }
    });
});

app.get('/logout', (req, res) => {
    res.redirect('/');
});

app.listen(8000);
