if (!process.env.MONGO_URI) {
    throw new Error("MONGO URI IS MISSING");
}

if (!process.env.ACCESSTOKEN_SECRET) {
    throw new Error("ACCESSTOKEN_SECRET IS MISSING");
}

if (!process.env.REFRESHTOKEN_SECRET) {
    throw new Error("REFRESHTOKEN_SECRET IS MISSING");
}

if (!process.env.CLIENT_URL) {
    throw new Error("CLIENT_URL IS MISSING");
}

if (!process.env.PORT_NUMBER) {
    throw new Error("PORT_NUMBER IS MISSING");
}

const config = {
    MONGO_URI: process.env.MONGO_URI,
    ACCESSTOKEN_SECRET: process.env.ACCESSTOKEN_SECRET,
    REFRESHTOKEN_SECRET: process.env.REFRESHTOKEN_SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
    PORT_NUMBER: process.env.PORT_NUMBER,
    
    // PayFast config keys bhi yahan add kar lein:
    PAYFAST_MERCHANT_ID: process.env.PAYFAST_MERCHANT_ID,
    PAYFAST_MERCHANT_KEY: process.env.PAYFAST_MERCHANT_KEY,
    PAYFAST_PASSPHRASE: process.env.PAYFAST_PASSPHRASE,
    PAYFAST_URL: process.env.PAYFAST_URL,
    FRONTEND_URL: process.env.FRONTEND_URL,
    BACKEND_URL: process.env.BACKEND_URL
};

module.exports = config;