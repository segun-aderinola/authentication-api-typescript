"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController = require('../controllers/authController');
const router = (0, express_1.Router)();
router.get('/signup', authController.signup_get);
router.get('/', authController.login_get);
router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map