const jwt = require("jsonwebtoken");
const config = require("../config/config.js")




const protect = async (req,res,next)=>{
    try{
        let header = req.headers.authorization;
        if(!header || !header.startsWith("Bearer ")){
            return res.status(401).json({message:"Access Token Not Found"})
        }
        const token = header.split(" ")[1];
        let decoded = jwt.verify(token,config.ACCESSTOKEN_SECRET)
        req.user = decoded;
        next();
    }catch(error){
        console.log(error.message);
        return res.status(401).json({ message: "Access token Expired/Invalid" });
    }
};

const authorize = (...allowedRoles) => (req,res,next)=>{
    if(!allowedRoles.includes(req.user.role)){
        return res.status(403).json({message:"Access Denied"});
    }
    next();
}


module.exports = {protect , authorize};