import express from "express";
import User from "../models/User";
import mongoose from "mongoose";


const router = express.Router();

router.post("/", (req, res) => {

  const user = new User({ ...req.body.user });
  const { password } = req.body.user;
  user.setPassword(password);
  user.save().then(userRecord => {
    res.json({ user: userRecord.toAuthJSON() });
  }).catch(err => res.status(400).json({ errors: { global: "Uppp something went wrong!!" } }))
});

export default router;
