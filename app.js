const express = require('express');
const router = require("./router/router.js");
const session = require('express-session');

const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}))

app.set('view engine','ejs');
app.use(express.static('./public'));
app.use(express.static('./avatar'));

app.get('/',router.showIndex);
app.get('/regist',router.showRegist);
app.post('/doRegist',router.doRegist);
app.get('/login',router.showLogin);
app.post('/doLogin',router.doLogin);
app.post('/fabiao',router.fabiao);
app.get('/getAllshuoshuo',router.getAll);     //得到所有说说
app.get('/user/:user',router.showUser);
app.get('/quit',router.quit);
app.get('/userlist',router.showUserList);



app.listen(3000);