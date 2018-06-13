const User = require('../models/user');
const path = require('path');
const jwt = require('jsonwebtoken');
const secret = 'RealMadrid'
module.exports = router => {
    console.log('Chuj')
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
        user.temporarytoken = jwt.sign({ username: user.username, email: user.email }, secret, {expiresIn: '24h'});
        if(req.body.username === '' || req.body.username === null || req.body.username === undefined || req.body.email === '' || req.body.email === null || req.body.email === undefined || req.body.password === '' || req.body.password === null || req.body.password === undefined) {
            res.json({ success: false, message: 'Formularz wypełniony nieprawidłowo'})
        } else if (req.body.password !== req.body.confirmPassword) {
            res.json({ success: false, message: 'Oba hasła muszą by takie same' })
        } else {
            user.save(function(err){
                if(err){
                    res.json({ success: false, message: err})
                } else {
                    res.json({ success: true, message: 'Rejestracja przebiegła prawidłowo' })
                }
            })
        }
    })
    return router
}