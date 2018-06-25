const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

let userSchema = new schema({
    username:
    {
        type: String,
        required: true,
        unique:true,
    },
    name:
    {
        type:String,
        required:true,
    },
    password:
    {
        type: String,
        required: true,
        select: false,
    },
    email:
    {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
    },
    active:
    {
        type: Boolean,
        required: true,
        default: false,
    },
    temporarytoken:
    {
        type: String,
        required:true,
    },
    resettoken:
    {
        type: String,
        required: false
    },
    permission:
    {
        type: String,
        required: true,
        default: 'user'
    },
})

userSchema.pre('save', function(next) {
    let user = this;
    if(!user.isModified('password')) return next();
    bcrypt.hash(this.password, null, null, (err, hash)=>{
        if(err) return err;
        this.password = hash; 
        next();
    })
})
userSchema.methods.comparePassword = function(password){
    return bcrypt.compareSync(password, this.password)
};

module.exports = mongoose.model('User', userSchema);