const crypto = require("crypto");


const generateSignature = (data,passphraser) => {
    let string = "";

    for(const [key,value] of Object.entries(data)){
        
        if(key === "signature"){
            continue;
        }

        let encodedValue = encodeURIComponent(String(value).trim()).replace(/%20/g,"+");
        string += `${key}=${encodedValue}&`;
    };

    string = string.slice(0,-1);

    if(passphraser !== undefined && passphraser.trim() !== null){
        let encodedPass = encodeURIComponent(passphraser).replace(/%20/g,"+");
        string += `&passphrase=${encodedPass}`
    }

    console.log("FINAL GENERATED STRING:", string); // Debug Line
    return crypto.createHash("md5").update(string).digest("hex");
}

module.exports  = generateSignature;