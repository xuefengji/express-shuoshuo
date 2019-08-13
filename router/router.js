const formidable = require('formidable');
const db = require('../models/db.js');
const crypto = require('crypto');





exports.showIndex = function (req,res,next) {
    // console.log(req.session.login+req.session.username);
    if (req.session.login == '1'){
        res.render('index',{
            'login':true,
            'username':req.session.username,
            'active':'全部说说'
        });
    }else{
        res.render('index',{'login':false,'username':'','active':'全部说说'});
    }
}

exports.showRegist = function (req,res,next) {
    if (req.session.login == '1'){
        res.render('regist',{
            'login':true,
            'username':req.session.username,
            'active':'全部说说'
        });
    }else{
        res.render('regist',{'login':false,'username':'','active':'全部说说'});
    }
}


exports.doRegist = function (req,res,next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        let username = fields.username;
        let password = fields.password;
        // console.log(username,password);
        db.find('shuoshuo','users',
            {'username':username},function (err,result) {
                if (result.length == 0){
                    db.insertOne('shuoshuo',
                        'users',
                        {'username':username,
                                'password':md5(md5(password))
                                },
                        function (err,result) {
                        })
                    req.session.login = '1';
                    req.session.username = username;
                    res.send('1');
                    return;
                }
                else {
                    res.send('-1');
                    return;
                }
            })
    });
}

exports.showLogin = function (req,res,next) {
    res.render('login');
}

exports.doLogin = function (req,res,next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        let username = fields.username;
        let password = fields.password;
        // console.log(username,password);
        password = md5(md5(password));
        db.find('shuoshuo','users',
            {'username':username},function (err,result) {
                if (result.length!=0){
                    if (password == result[0].password){
                        req.session.login = '1';
                        req.session.username = username;
                        res.send('1');
                        return;
                    }
                    else{
                        res.send('-2');
                        return;
                    }
                }
                else {
                    res.send('-1');
                    return;
                }
            })
    });
}

exports.fabiao = function (req,res,next) {
    var form = new formidable.IncomingForm();

    form.parse(req, function(err, fields, files) {
        let username = req.session.username;
        let content = fields.content;
        let date = fields.date;
        db.insertOne('shuoshuo',
            'posts',
            {'username':username,'content':content,'date':date},     function (err,result) {
            res.send('1');
        })


    });
}

exports.getAllCount = function(req,res,next){

}

exports.getAll = function (req,res,next) {
    var page = req.query.page;
    db.find('shuoshuo',
        'posts',
        {},
        {'sort':{'date': -1}},
        function (err,result) {
            res.json({'r':result});
        }
        )
}

exports.showUser = function (req,res,next) {
    let user = req.params["user"];
    db.find('shuoshuo','posts',
        {'username':user},
        function (err,result) {
            res.render('user',{
                'login':req.session.login=='1'?true:false,
                'username':req.session.login=='1'?req.session.username:" ",
                'user':user,
                'cirenshuoshuo':result,
                'active':'我的说说'
            });
        })
}

//显示成员列表
exports.showUserList = function(req,res,next){
    db.find('shuoshuo',
        'users',
        {},
        function (err,result) {
            res.render('userlist',{
                'login':req.session.login=='1'?true:false,
                'username':req.session.login=='1'?res.session.username:'',
                'active':'成员列表',
                'chengyuan':result
            })
        }
    )
}



//退出
exports.quit = function (req,res,next) {
    req.session.login = '-1';
    req.session.username = " ";
    res.redirect('/');
}


function md5(str) {
    let hash = crypto.createHash('md5');
    return hash.update(str).digest('base64');
}