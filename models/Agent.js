const mongoose = require('mongoose');
// const {isEmail} = require('validator');
const bcrypt = require('bcrypt');

const agentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Can't be blank"]
    },
    contact: {
        type: String,
        requires: [true, "Can't be blank"]
    },
    password: {
        type: String,
        required: [true, "Can't be blank"]
    }
});

agentSchema.pre('save', function(next){
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

agentSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    return userObject;
}

const Agent = new mongoose.model("Agent", agentSchema);
module.exports = Agent