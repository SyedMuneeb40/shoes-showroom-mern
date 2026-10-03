const cloudinary = require("../config/cloudinary.js")


const uploadToCloudinary = (buffer) => {
    return new Promise(
        (resolve , reject)=>{
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder : "Shoe-showroom"
                },
                (error,result)=>{
                    if(error){
                        return reject(error)
                    }else{
                        resolve(result)
                    }
                }
            );

            stream.end(buffer);
        }
)
};


module.exports = uploadToCloudinary;