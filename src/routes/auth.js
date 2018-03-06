import express from "express";
import User from "../models/User";


const router = express.Router();

router.post("/", (req, res) => {
  const { credentials } = req.body;
  User.findOne({ email: credentials.email }).then(user => {
    if (user && user.isValidPassword(credentials.password)) {
      //res.json({ user: user.toAuthJSON() });
      const validUser = JSON.stringify({ user: user.toAuthJSON() })
      res.cookie('user', validUser, { maxAge: 900000, httpOnly: false })
      res.end();
    } else {
      res.status(404).json({ errors: { global: "Invalid credentials" } });
    }
  });
});



export default router;
