const jwt = require("jsonwebtoken")
const config = require("../config/config.js")
const crypto = require("crypto");
const { model } = require("mongoose");


const generateAccesstoken = (user) => {
    return jwt.sign(
        {
            id: user._id,
            role: user.role
        },config.ACCESSTOKEN_SECRET,
        {
            expiresIn: "15m"
        }
    );
};

const generateRefreshtoken = (user) => {
    return jwt.sign(
        {
            id: user._id,
        },config.REFRESHTOKEN_SECRET,
        {
            expiresIn: "7d"
        }
    );
};


const hashToken = (token) => {
    return crypto.createHash("sha256").update(token).digest("hex");
}

const refreshCookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/api/auth",
    maxAge: 7 * 24 * 60 * 60 * 1000
};


module.exports = {generateRefreshtoken , generateAccesstoken , hashToken , refreshCookieOptions};