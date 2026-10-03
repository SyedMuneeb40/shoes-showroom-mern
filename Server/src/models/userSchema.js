const mongoose = require ("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        username: 
        {
            type: String,
            required: [true,"Name must be required"],
            trim:true,
            unique:true
        },
        email:
        {
            type: String,
            required: [true,"email must be required"],
            trim:true,
            unique:true
        },
        password:
        {
            type: String,
            required: [true,"password must be required"],
            trim:true,
            select:false,
            minlength: 6
        },
        role:
        {
            type: String,
            enum: ["admin","customer"],
            default: "customer"
        },
        refreshToken:
        {
            type:String,
            select: false
        }
    },
    {
        timestamps:true
    }
);

userSchema.pre("save", async function () {
    if(!this.isModified("password")){
        return;
    }
    this.password = await bcrypt.hash(this.password,10)
});

userSchema.methods.comparePassword = async function(plain) {
    return bcrypt.compare(plain,this.password)
};

const UserModel = mongoose.model("User",userSchema);

module.exports = UserModel;

