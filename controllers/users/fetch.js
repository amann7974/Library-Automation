const connection = require("../../utils/dbConnection");

const fetchUsers = async (req, res, next) => {
  const query = "SELECT sno, name, email, username, role FROM users";
  
  try {
    const results = await connection.query(query);
    req.users = results.rows;
    next();
  } catch (err) {
    return res.status(500).json({ error: "Error fetching users", err });
  }
};

module.exports = fetchUsers;
