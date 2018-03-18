import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
import autoIncrement from 'mongoose-auto-increment';
import crypto from 'crypto';


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
  access_token: {
    type: String
  },
  refresh_token: {
    type: String
  }
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
    { expiresIn: process.env.TOKEN_EXPIRATION }
  );
};

schema.methods.generateRefreshToken = function generateRefreshToken() {
  return `${this._id}.${crypto.randomBytes(40).toString('hex')}`
};


schema.methods.toAuthJSON = function toAuthJSON() {
  return {
    email: this.email,
    name: `${this.firstname} ${this.lastname}`,
    id: this._id,
    access_token: this.generateJWT(),
    refresh_token: this.generateRefreshToken()
  };
};

schema.methods.recordToJSON = function recordToJSON() {
  return {
    email: this.email,
    name: `${this.firstname} ${this.lastname}`,
    id: this._id,
    access_token: this.access_token,
    refresh_token: this.refresh_token
  };
};

schema.plugin(uniqueValidator, { message: "This email is already taken" });
schema.plugin(autoIncrement.plugin, "User");

export default mongoose.model("User", schema);
