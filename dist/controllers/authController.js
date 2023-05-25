"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User = require('../models/User');
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorHandler = (err) => {
    let errors = { email: "", password: "" };
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
};
const expriryTime = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, 'segun secret code', {
        expiresIn: expriryTime
    });
};
module.exports.signup_get = (req, res) => {
    res.render('user/register');
};
module.exports.login_get = (req, res) => {
    res.render('user/login');
};
module.exports.signup_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const borrowStatus = "no";
    try {
        const user = yield User.create({ email, password, borrowStatus });
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: expriryTime * 1000 });
        res.status(201).json({ user: user._id });
    }
    catch (error) {
        errorHandler(error);
        res.status(400).json({ error });
    }
});
module.exports.login_post = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const error = { email: '', password: '' };
    try {
        const user = yield User.findOne({ email });
        if (user) {
            const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                res.status(401).json({ error: { 'password': 'Invalid Password' } });
                return;
            }
            else {
                const token = createToken(user);
                res.cookie('user_login', token, { httpOnly: true, maxAge: expriryTime * 1000 });
                res.staus(200).json({ user: user._id });
            }
        }
        else {
            res.status(400).json({ error: { 'email': 'User not found' } });
        }
    }
    catch (err) {
        res.status(400).json({ err });
    }
});
module.exports.logout_get = (req, res) => {
    res.cookie("user_login", "", { maxAge: 1 });
    res.redirect('/');
};
//# sourceMappingURL=authController.js.map