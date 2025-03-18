const connection = require("../../utils/dbConnection");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, username, password, role } = req.body;
  
  try {
    if (password) {
      const hash = await bcrypt.hash(password, saltRounds);
      const query = "UPDATE users SET name=$1, email=$2, username=$3, password=$4, role=$5 WHERE sno=$6 RETURNING *";
      const results = await connection.query(query, [name, email, username, hash, role, id]);
      
      if (results.rowCount === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ message: "User updated successfully" });
    }
    
    const query = "UPDATE users SET name=$1, email=$2, username=$3, role=$4 WHERE sno=$5 RETURNING *";
    const results = await connection.query(query, [name, email, username, role, id]);
    
    if (results.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Error updating user", err });
  }
};

module.exports = updateUser;
