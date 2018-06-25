const User          = require('../models/user');
const path          = require('path');
const jwt           = require('jsonwebtoken');
const secret        = 'yourSecretKey';
const nodemailer    = require('nodemailer');

module.exports = router => {
    let client = nodemailer.createTransport({ 
        service: 'gmail',
        auth: {
            user: 'yourEmail@gmail.com',
            pass: 'yourPassword'
        },
        tls: { rejectUnauthorized: false }
    });

    router.get('/users', (req, res)=> {
        User.find({}, (err, user)=>{
            console.log(user)
        })
    });
    router.post('/register/user', (req, res)=> {
        let user = new User();
        user.username = req.body.username;
        user.name = req.body.name;
        user.email = req.body.email;
        user.password = req.body.password;
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
        if(req.body.username === '' || req.body.username === null || req.body.username === undefined || req.body.email === '' || req.body.email === null || req.body.email === undefined || req.body.password === '' || req.body.password === null || req.body.password === undefined) {
            res.json({ success: false, message: 'Please check form again'})
        } else if (req.body.password !== req.body.confirmPassword) {
            res.json({ success: false, message: 'Both passwords must match' })
        } else {
            user.save(function(err){
                if(err){
                    console.log(err.errors)
                    if(err.errors != null) {
                        if(err.errors.name){
                            res.json({success:false, message: err.errors.name.message});  
                        } else if(err.errors.email){
                            res.json({success:false, message:err.errors.email.message})
                        } else if(err.errors.username){
                            res.json({success:false, message:err.errors.username.message})
                        } else if(err.errors.password){
                            res.json({success:false, message:err.errors.password.message})
                        } else {
                            res.json({success: false, message: err})
                        }                      
                    } else if (err) {
                        if(err.code === 11000) {
                            if(err.errmsg.includes('username')){
                                res.json({success: false, message: "This username has been taken"})
                            } else if(err.errmsg.includes('email')) {
                                res.json({success: false, message: "This email address has been taken"})
                            }
                        } else {
                            res.json({success: false, message:err})
                        }
                    } 
                } else {
                    let email = {
                        from: 'React tutorial App',
                        to: user.email,
						subject: 'Activation link',
						text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
						html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate/</a>'
                    }
                    client.sendMail(email, (err, info)=> {
                        if(err) {
                            res.json({ success: false, message: err })
                        }
                    })
                    res.json({ success: true, message: 'Thank you for registering! Please check your email to active account' })
                }
            })
        }
    });
    router.put('/activate/:token', (req, res) => {
        let token = req.params.token;
        User.findOne({ temporarytoken: token }, (err, user) => {
            if(err){
                res.json({ success: false, message: err })
            }
            jwt.verify(token, secret, (err, decoded)=>{
                if(err){
                    res.json({ success: false, message: 'Invalid credentials' })
                } else if(!user){
                    res.json({ success: false, message: 'User not found' })
                } else if(user.active){
                    res.json({ success: false, message: 'Your account has been already activated' })
                } else {
                    user.temporarytoken = false;
                    user.active = true;
                    user.save((err)=>{
                        let email = {
                            from: 'React tutorial App',
                            to: user.email,
                            subject: 'Account activated',
                            text: 'Hello again ' + user.name + ' ,Your account has been activated!',
                            html: 'Hello again<strong> ' + user.name + '</strong>,<br><br>Your account has been activated!'
                        };
                        client.sendMail(email, (err,info)=>{
                            if(err) {
                                res.json({ success: false, message: err })
                            }
                        });
                        res.json({ success:true, message:'Your account has been successfully activated! Redirecting...' });
                    })
                }
            })
        })
    });
    router.put('/resend', (req, res)=>{
        User.findOne({ username: req.body.username }).select('username email temporarytoken').exec((err, user)=>{
            if(err){
                res.json({ success: false, message: err })
            } else if(!user){
                res.json({ success: false, message: 'This username not found' })
            } else {
                user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                user.save(err =>{
                    let email = {
                        from: 'React tutorial App',
                        to: user.email,
                        subject: 'Activation link',
                        text: 'Hello ' + user.name + ', thank you for registering at localhost.com. Please click on the following link to complete your activation: http://localhost:8080/activate/' + user.temporarytoken,
                        html: 'Hello<strong> ' + user.name + '</strong>,<br><br>Thank you for registering at localhost.com. Please click on the link below to complete your activation:<br><br><a href="http://localhost:8080/activate/' + user.temporarytoken + '">http://localhost:8080/activate/</a>'
                    }
                    client.sendMail(email, (err, info)=> {
                        if(err) {
                            res.json({ success: false, message: err })
                        }
                    })
                    res.json({ success: true, message: `Activation link has been sent on: ${user.email}!` })
                })
            }

        })
    })
    router.post('/authenticate', (req,res)=>{
        User.findOne({ username: req.body.username }).select('username email active password').exec((err, user)=>{
            if(err){
                res.json({ success: false, message: err })
            } else if(user){
                if(!req.body.password){
                    res.json({ success: false, message: 'Password no provided' })
                } else {
                    let validPassword = user.comparePassword(req.body.password); 
                    if(!validPassword){
                        res.json({ success: false, message: 'Incorrect password' })
                    } else if(!user.active){
                        res.json({ success: false, message: 'Your account has not been activated yet', expired: true })
                    } else {
                        let token = jwt.sign({ username: user.username, email: user.email }, secret, { expiresIn: '24h' });
                        res.json({ success: true, message: 'You have signed in successfully!', token: token, permission: user.permission })
                    }
                }
            } else {
                res.json({ success: false, message: 'User not found' })
            }
        })
    })
    return router
}