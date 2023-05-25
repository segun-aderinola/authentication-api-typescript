const User = require('../models/User');
import jwt from 'jsonwebtoken'
import bcrypt from "bcrypt";


// error handler function
const errorHandler = (err) => {

    let errors = { email: "", password: "" }
    
    if (err.code === 11000) {
        errors.email = 'That email is already registered';
        
        return errors;
    }
    if (err.message.includes('user validation failed')) {
        Object.values(err.errors).forEach(({ properties }) => {
            errors[properties.path] = properties.message;
        });
    }
    return errors;
}


// set token for user authentication
const expriryTime = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jwt.sign({ id }, 'segun secret code', {
        expiresIn: expriryTime
    })
}


// get signup route controller
module.exports.signup_get = (req, res) => {
    res.render('user/register')
}

// get login route controller
module.exports.login_get = (req, res) => {
    res.render('user/login')
}

// post signup route controller
module.exports.signup_post = async (req, res) => {
    const { email, password} = req.body;

    try {
        const user = await User.create({ email, password })
        const token = createToken(user._id)
        res.cookie('user_token_auth', token, { httpOnly: true, maxAge: expriryTime * 1000 })
        res.status(201).json({ user: user._id });
    } catch (error) {
        const errors = errorHandler(error)
        res.status(400).json({ errors })
    }

}

// post login route controller
module.exports.login_post = async (req, res) => {
    const { email, password } = req.body;
    const errors = {email: '', password:''}
    try {
        const user = await User.findOne({ email });
        if (user) {
            const isPasswordValid = await bcrypt.compare(password, user.password);
            
            if (!isPasswordValid) {
                errors.password = 'Incorrect Password';
                res.status(401).json({ errors } );
                return;                
            }
            else{
                const token = createToken(user);
                res.cookie('user_token_auth', token, { httpOnly: true, maxAge: expriryTime * 1000 })
                res.staus(200).json({ user: user._id});
            }                        
        }
        else{
            errors.email = 'User not found';
            res.status(400).json({ errors })
            
        }
    }
    catch (err) {
        
        res.status(400).json({ err })
    }
 
}

// logout route controller
module.exports.logout_get = (req, res)=>{
    res.cookie("user_token_auth", "", { maxAge:1 })
    res.redirect('/')
}