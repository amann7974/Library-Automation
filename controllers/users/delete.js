const connection = require("../../utils/dbConnection");

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE sno = $1 RETURNING *";

  try {
    const results = await connection.query(query, [id]);
    if (results.rowCount === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Error deleting user", err });
  }
};

module.exports = deleteUser;
