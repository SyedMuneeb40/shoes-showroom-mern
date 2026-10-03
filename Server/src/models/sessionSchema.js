const mongoose = require("mongoose");
const crypto = require("crypto");


const sessionSchema = new mongoose.Schema(
{
    user_id:
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true,"user id must be required"]
    },
    ip:
    {
        type: String
    },
    userAgent:
    {
        type:String,
        required: [true,"user id must be required"]
    },
    refreshToken:
    {
        type:String,
        unique:true
    },
    revoked:
    {
        type:Boolean,
        default:false
    }

},
{
    timestamps:true
}
);

sessionSchema.methods.compareRefreshToken = function (plain) {
    let decoded = crypto.createHash("sha256").update(plain).digest("hex");
    return decoded === this.refreshToken ? true : false
}

const SessionModel = mongoose.model("Session",sessionSchema);
module.exports = SessionModel
