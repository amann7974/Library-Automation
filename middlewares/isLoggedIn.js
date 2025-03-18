const jwt = require('jsonwebtoken');
require('dotenv').config();

const isLoggedIn = async (req, res, next) => {
    let token = req.cookies.accesstoken;

    

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }  

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }



        if (decoded.username) {
            req.decoded = decoded;
            next();
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    });
}

module.exports = isLoggedIn;