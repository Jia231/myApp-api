import express from "express";
import User from "../models/User";


const router = express.Router();

router.post("/", (req, res) => {
  const { credentials } = req.body;
  User.findOne({ email: credentials.email }).then(user => {
    if (user && user.isValidPassword(credentials.password)) {
      //res.json({ user: user.toAuthJSON() });
      const foundUser = user.toAuthJSON();
      let newData = {
        "access_token": foundUser.access_token,
        "refresh_token": foundUser.refresh_token
      }
      User.findOneAndUpdate({ email: credentials.email },
        newData, { upsert: true, new: true }, function (err, doc) {
          if (err) {
            return res.send(500, { error: err });
          }
          const validUser = JSON.stringify({ user: doc.recordToJSON() })
          res.cookie('user', validUser, { maxAge: 900000, httpOnly: false })
          res.end();
        });
    }
    else {
      res.status(404).json({ errors: { global: "Invalid credentials" } })
    }
  })
});

export default router;
