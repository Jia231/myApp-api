import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
import autoIncrement from 'mongoose-auto-increment';


autoIncrement.initialize(mongoose.connection);
const schema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  birthDate: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
    unique: true
  },
  passwordHash: {
    type: String,
    required: true
  },
});


schema.methods.isValidPassword = function isValidPassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

schema.methods.setPassword = function setPassword(password) {
  this.passwordHash = bcrypt.hashSync(password, 10);
};

schema.methods.generateJWT = function generateJWT() {
  return jwt.sign(
    {
      email: this.email,
      name: `${this.firstname} ${this.lastname}`,
      id: this._id
    },
    process.env.JWT_SECRET,
    { expiresIn: "1s" }
  );
};
schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    name: `${this.firstname} ${this.lastname}`,
    id: this._id,
    token: this.generateJWT()
  };
};

schema.plugin(uniqueValidator, { message: "This email is already taken" });
schema.plugin(autoIncrement.plugin, "User");

export default mongoose.model("User", schema);
