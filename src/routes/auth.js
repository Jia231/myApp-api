import express from "express";
import User from "../models/User";


const router = express.Router();

router.post("/", (req, res) => {
  const { credentials } = req.body;
  //console.log(credentials.password)
  User.findOne({ email: credentials.email }).then(user => {
    if (user && user.isValidPassword(credentials.password)) {
      //console.log(user.toAuthJSON())
      res.json({ user: user.toAuthJSON() });
    } else {
      res.status(404).json({ errors: { global: "Invalid credentials" } });
    }
  });
});

export default router;
