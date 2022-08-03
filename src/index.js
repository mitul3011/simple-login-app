const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const auth = require('./middleware/auth');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT;

const publicDirectoryPath = path.join(__dirname, '../public');

app.use(express.json());
app.use(cookieParser());
app.set('view engine', 'hbs');
app.use(express.static(publicDirectoryPath));

app.get('/', (req, res) => {
    if(req.cookies.token){
        return res.redirect('/home');
    }

    res.render('index');
});

app.get('/signup', (req, res) => {
    if(req.cookies.token){
        return res.redirect('/home');
    }

    res.render('signup');
});

app.get('/home', auth, (req, res) => {
    res.render('home', {
        name: req.user.name,
        email: req.user.email
    });
});

app.get('/update', auth, (req, res) => {
    const date = new Date(req.user.dob);
    const dob = date.toISOString().split('T')[0];

    res.render('updateUser', {
        name: req.user.name,
        email: req.user.email,
        gender: req.user.gender,
        dob
    });
});

app.get('/success', (req, res) => {
    res.render('success', {
        task: req.query.task
    });
});

app.post('/signup', async (req, res) => {

    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie('token', 'Bearer ' + token);
        res.status(201).send();
    } catch (error) {
        res.status(400).send(error);
    }
});

app.post('/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        res.cookie('token', 'Bearer ' + token);
        res.send();
    } catch (error) {
        if(error.message === 'Email is not registered!')
            res.status(404).send({ 'Error': error.message });
        else
            res.status(400).send({ 'Error': error.message });
    }
});

app.patch('/update', auth, async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const user = req.user;

        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();

        res.send();
    } catch (error) {
        res.status(400).send(error);
    }
});

app.delete('/deletePro', auth, async (req, res) => {

    try {
        await req.user.remove();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send(error);
    }
});

app.post('/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        });

        await req.user.save();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

app.post('/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.clearCookie('token');
        res.send();
    } catch (error) {
        res.status(500).send();
    }
});

app.get('/*', (req, res) => {
    res.render('404');
});

app.listen(port, () => {
    console.log('Server is up on port', port);
});