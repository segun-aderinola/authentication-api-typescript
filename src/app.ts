import express, { Application, Request, Response, NextFunction, urlencoded } from 'express';
const app: Application = express();
import authRoutes from '../routes/authRoutes';
import cookieParser from 'cookie-parser';
import auth from '../middleware/authMiddleware';
require("dotenv").config();
require("../config/database").connect();

 

// middleware
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(cookieParser())



// set routes

// user auth routes
app.use(authRoutes)

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome");
  });
  
// set default 404 route
app.use((req, res)=>{
    res.status(404).send('404')
})


// start server
const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });