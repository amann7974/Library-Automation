const connection = require("../../utils/dbConnection");

const getSingleUser = async (req, res, next) => {
  const { id } = req.params;
  const query = "SELECT sno, name, email, username, role FROM users WHERE sno = $1";

  try {
    const results = await connection.query(query, [id]);
    if (results.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    
    req.user = results.rows[0];
    next();
  } catch (err) {
    return res.status(500).json({ error: "Error fetching user", err });
  }
};

module.exports = getSingleUser;
