import express from "express";
import path from "path";
import mongoose from "mongoose";
import auth from "./routes/auth";
import bodyParser from "body-parser";
import Promise from "bluebird";
import user from "./routes/user";

const app = express();
mongoose.Promise = Promise;
mongoose.connect("mongodb://localhost/myApp", { useMongoClient: true });
app.use(bodyParser.json());
app.use("/api/auth", auth);
app.use("/api/user", user);

app.listen(80, () => console.log("Running on localhost:8080"));
