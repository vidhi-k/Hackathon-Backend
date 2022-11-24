const mongoose = require('mongoose');
// const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Can't be blank"]
    },
    contact: {
        type: String
    },
    password: {
        type: String,
        required: [true, "Can't be blank"]
    }
});

customerSchema.pre('save', function(next){
    const user = this;
    if(!user.isModified('password')) return next();
  
    bcrypt.genSalt(10, function(err, salt){
      if(err) return next(err);
  
      bcrypt.hash(user.password, salt, function(err, hash){
        if(err) return next(err);
  
        user.password = hash
        next();
      })
  
    })
  
})

customerSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

const Customer = new mongoose.model("Customer", customerSchema);
module.exports = Customer