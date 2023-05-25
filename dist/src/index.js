"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const users = [
    {
        id: 1,
        username: 'user1',
        password: '$2a$10$VL5LeSTCZMTpI8Dg35ZjhuVmYbYKM9RXprn8BQEkj5d5yTpAghrIu',
        email: 'user1@example.com',
    },
    {
        id: 2,
        username: 'user2',
        password: '$2a$10$VL5LeSTCZMTpI8Dg35ZjhuVmYbYKM9RXprn8BQEkj5d5yTpAghrIu',
        email: 'user2@example.com',
    },
];
const JWT_SECRET = 'your_secret_key';
function createToken(user) {
    const tokenData = {
        id: user.id,
        username: user.username,
        email: user.email,
    };
    return jsonwebtoken_1.default.sign(tokenData, JWT_SECRET, { expiresIn: '1h' });
}
function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        return null;
    }
}
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find((u) => u.username === username);
    if (!user) {
        res.status(401).send('Invalid username or password');
        return;
    }
    const isPasswordValid = bcryptjs_1.default.compareSync(password, user.password);
    if (!isPasswordValid) {
        res.status(401).send('Invalid username or password');
        return;
    }
    const token = createToken(user);
    res.send({ token });
});
app.get('/me', (req, res) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        res.status(401).send('Unauthorized');
        return;
    }
    const tokenData = verifyToken(token);
    if (!tokenData) {
        res.status(401).send('Unauthorized');
        return;
    }
    const user = users.find((u) => u.id === tokenData.id);
    if (!user) {
        res.status(401).send('Unauthorized');
        return;
    }
    res.send(user);
});
app.listen(3000, () => {
    console.log('Server started on port 3000');
});
//# sourceMappingURL=index.js.map