const jwt = require("jsonwebtoken");
const connection = require("../../utils/dbConnection");

const query = `SELECT * FROM users WHERE username = $1 AND role = 'admin'`;

const isAdmin = async (req, res, next) => {
  let token = req.cookies.accesstoken;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    if (decoded.username) {
      const results = await connection.query(query, [decoded.username]);

      if (results.rows.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      const user = results.rows[0];
      if (user.username === decoded.username) {
        next();
      } else {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      return res.status(401).json({ error: "Unauthorized" });
    }
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

module.exports = isAdmin;
