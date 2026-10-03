const {generateRefreshtoken , generateAccesstoken , hashToken , refreshCookieOptions} = require("../utils/token.js")
const SessionModel = require("../models/sessionSchema.js");
const UserModel = require("../models/userSchema.js");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../config/config.js")

const sendAuthResponse = async (user,req,res,status = 200)=>{
    let accessToken = generateAccesstoken(user)
    let refreshToken = generateRefreshtoken(user)

    let decodeRefreshToekn = hashToken(refreshToken) 
    user.refreshToken = decodeRefreshToekn
    await user.save()


    await SessionModel.create(
        {
            user_id: user._id,
            ip:req.ip,
            userAgent: req.headers["user-agent"],
            refreshToken: decodeRefreshToekn
        }
    );

    res.cookie("refreshToken",refreshToken,refreshCookieOptions);
    res.status(status).json({
        user: {id: user._id , name: user.username , email: user.email , role: user.role},
        accessToken: accessToken
    });
};


// POST /api/auth/register
const register = async (req,res)=>{
    try{
        let {username , email , password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({message:"Must fill All Fields"})
        }
        let isAlreadyExist = await UserModel.findOne(
            {
                $or:
                [
                    {username},
                    {email}
                ]
            }
        );

        if(isAlreadyExist){
            return res.status(409).json({message:"user already exists with this username/email"})
        }

        let user = await UserModel.create(
            {
                username,
                email,
                password
            }
        )

        await sendAuthResponse(user,req,res,201);
    }catch(error){
        console.log(error.message)
    }
};


// POST /api/auth/login
const login = async (req,res)=>{
    try{
        let {email,password} = req.body;
        let user = await UserModel.findOne({email}).select("+password");

        if(!user || !(await user.comparePassword(password)) ){
            return res.status(401).json({message:"Email/Password is not correct"})
        }
        await sendAuthResponse(user,req,res);
    }catch(error){
        console.log(error.message)
    }
};

// POST /api/auth/refresh  ← silent refresh yahan hit hota hai
const refresh  = async (req,res)=>{
    let token = req.cookies.refreshToken;
    if(!token){
        return res.status(401).json({message:"Refresh Token Not Found"})
    }
    let hashedRefreshToken =  crypto.createHash("sha256").update(token).digest("hex");

    let session = await SessionModel.findOne({
        refreshToken: hashedRefreshToken,
        revoked:false
    })

    if(!session){
        const {maxAge,...Clearopts} = refreshCookieOptions
        res.clearCookie("refreshToken",Clearopts)
        return res.status(403).json({message:"Session is not Valid"})
    }

    let decode;
    try{
        decode = jwt.verify(token,config.REFRESHTOKEN_SECRET);
    }catch(error){
        return res.status(401).json({message:"Token is not Valid/Expire"})
    }

    let user = await UserModel.findById(decode.id);
    if(!user){
        return res.status(404).json({message:"User not found with this Token"})
    }

    let newAccessToken = generateAccesstoken(user);
    let newRefreshToken = generateRefreshtoken(user);
    let newRefreshTokenHash  = hashToken(newRefreshToken);
    session.refreshToken = newRefreshTokenHash;
    await session.save();

    res.cookie("refreshToken",newRefreshToken,refreshCookieOptions);

    return res.status(200).json({user: {id: user._id , name: user.username , email: user.email , role: user.role},accessToken:newAccessToken});
};


// POST /api/auth/logout
const logout = async (req,res)=>{
    let token = req.cookies.refreshToken
    if(!token){
        return res.status(401).json({message:"Token Not Found"});
    }
    let decode;
    try{
        decode = jwt.verify(token,config.REFRESHTOKEN_SECRET);
    }catch(error){
        return res.status(401).json({message:"Token is Invalid"})
    }
    let refreshTokenHash = hashToken(token);
    let session = await SessionModel.findOne({
        refreshToken:refreshTokenHash,
        revoked:false
    });
    if(!session){
        return res.status(403).json({message:"Session is Invalid"})
    }
    session.revoked = true
    await session.save();

    const {maxAge,...clearopts} = refreshCookieOptions;

    res.clearCookie("refreshToken",clearopts)
    res.status(200).json({message:"logged out"})
};

// GET /api/auth/me
const me = async (req,res)=>{
    try{
        let user_id = req.user.id;
        let user = await UserModel.findById(user_id);
        if(!user){
            return res.status(404).json({message:"User Not Found"})
        }
        return res.status(200).json({user});
    }catch(error){
        console.log(error.message);
    }
};


module.exports = {register,login,refresh,logout,me};