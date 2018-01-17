import express from "express";
import User from "../models/User";
import mongoose from "mongoose";


const router = express.Router();

router.post("/", (req, res) => {
  const _id = mongoose.Types.ObjectId();
  const user = new User({ ...req.body.user, _id: _id });
  const { password } = req.body.user;
  user.setPassword(password);
  user.save().then(userRecord => console.log(userRecord))

});

export default router;
