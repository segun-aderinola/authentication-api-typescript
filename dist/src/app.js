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
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const mongoose_1 = __importDefault(require("mongoose"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const Book_1 = __importDefault(require("../models/Book"));
const Borrowstatus = require('../models/bookBorrowing');
const User = require('../models/User');
// middleware
app.use(express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
// view engine
app.set('view engine', 'ejs');
// mongoose connection string and server connection
const port = 3000 || process.env.PORT;
const URI = 'mongodb://127.0.0.1:27017/book_library';
mongoose_1.default.connect(URI, {}).then(result => {
    console.log('Database Connected');
    app.listen(port, () => {
        return console.log(`Server is listening at port ${port}`);
    });
}).catch(err => {
    console.log(err);
});
// set routes
// user auth routes
app.use(authRoutes_1.default);
app.get('/library', authMiddleware_1.default, (req, res) => res.render('user/library'));
app.post('/request-book', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId, userId } = req.body;
    // verify if book exist
    const book = yield Book_1.default.findOne({ bookId });
    if (book.status === "available") {
        const bId = Math.floor(Math.random() * 100000);
        const getDate = new Date();
        const mm = getDate.getMonth() + 1;
        const dd = getDate.getDate();
        const yy = getDate.getFullYear();
        const borrowDate = dd + '/' + mm + '/' + yy;
        // console.log(bId, borrowDate);
        const borrowstatus = new Borrowstatus({
            borrowingId: bId,
            bookId: bookId,
            userId: userId,
            borriwingDate: borrowDate,
            dueDate: borrowDate
        });
        borrowstatus.save()
            .then((result) => {
            const updateUser = User.updateOne({ 'email': userId }, { $set: { borrowStatus: 'yes' } });
            if (updateUser) {
                res.json({ updated: true });
            }
            else {
                res.json({ updated: false });
            }
        })
            .catch((err) => {
            console.log(err);
        });
    }
    else {
        res.json({ error: 'Book not available' });
    }
}));
app.post('/add-book', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { bookId, bookTitle, bookAuthor, bookContent, status } = req.body;
    const book = new Book_1.default({
        bookId: bookId,
        bookTitle: bookTitle,
        author: bookAuthor,
        content: bookContent,
        status: status
    });
    book.save()
        .then((result) => {
        res.redirect('/');
    })
        .catch((err) => {
        console.log(err);
    });
}));
// set default 404 route
app.use((req, res) => {
    res.status(404).send('404');
});
//# sourceMappingURL=app.js.map