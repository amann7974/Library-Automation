const connection = require("../../utils/dbConnection");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const loggedInUser = (req, res, next) => {
    // Get token from cookies
    let token = req.cookies.accesstoken;

    if (!token) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (decoded.username) {
            // Query to get user details
            const query = "SELECT sno, name, email, username, role FROM users WHERE username = $1";
            
            connection.query(query, [decoded.username])
                .then(result => {
                    if (result.rows.length === 0) {
                        return res.status(404).json({ error: "User not found" });
                    }

                    // Store user data in request object
                    req.user = result.rows[0];
                    req.decoded = decoded;
                    next();
                })
                .catch(err => {
                    return res.status(500).json({ error: "Error finding user", err });
                });
        } else {
            return res.status(401).json({ error: "Unauthorized" });
        }
    });
};

module.exports = loggedInUser;