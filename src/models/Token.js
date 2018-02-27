import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


const schema = new mongoose.Schema({
    appName: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    lastModified: {
        type: Date,
        required: true
    }
})

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
}

export default mongoose.model("Token", schema)