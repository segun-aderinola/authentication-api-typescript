"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const requireAuth = (req, res, next) => {
    const token = req.cookies.user_login;
    // check if token exist
    if (token) {
        jsonwebtoken_1.default.verify(token, 'segun secret code', (err, decodedToken) => {
            if (err) {
                console.log(err.message);
                res.redirect('/');
            }
            else {
                console.log(decodedToken);
                next();
            }
        });
    }
    else {
        res.redirect('/');
    }
};
exports.default = requireAuth;
//# sourceMappingURL=authMiddleware.js.map