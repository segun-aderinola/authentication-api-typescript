import mongoose from "mongoose";
import {isEmail} from "validator";
import bcrypt from "bcrypt";

const passwordValidator = function (value) {
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,20}$/;
    return regex.test(value);
  };

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: [8, "Password must have at least 8 characters"],
        validate: {
            validator: passwordValidator,
            message:
              'Password must contain at least one uppercase letter, one lowercase letter and one number.',
          },
    }
    
})


// hash passowrd using bcrypt before saving
userSchema.pre('save', async function(next){
    const salt = await bcrypt.genSalt()
     this.password = await bcrypt.hash(this.password, salt);
     next()
})


const User = mongoose.model('user', userSchema);

module.exports = User;