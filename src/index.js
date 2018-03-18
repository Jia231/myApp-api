import express from "express";
import path from "path";
import mongoose from "mongoose";
import auth from "./routes/auth";
import bodyParser from "body-parser";
import Promise from "bluebird";
import user from "./routes/user";
import movie from "./routes/movie";
//import refreshToken from "./routes/refreshToken";
import dotenv from "dotenv";
import validateToken from './middlewares/validateToken';
import cookieParser from 'cookie-parser';



dotenv.config();

const app = express();
mongoose.Promise = Promise;
mongoose.connect(process.env.MONGODB_URL, { useMongoClient: true });



app.use(function (req, res, next) {
    //res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Origin", req.headers.origin)
    /*res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");*/
    //res.header("Access-Control-Request-Headers", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cookies");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
})

app.use(bodyParser.json());
app.use(cookieParser())



app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/movie", validateToken, movie);
//app.use("/api/refreshToken", refreshToken);

app.listen(8080, () => console.log("Running on localhost:8080"));

module.exports = app;
