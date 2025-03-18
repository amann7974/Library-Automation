const bcrypt = require("bcrypt");
const saltRounds = 10;
const pool = require("../../utils/dbConnection"); // Assuming this is now a postgres pool

const query = `INSERT INTO users (name, email, username, password, role) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`; // PostgreSQL uses $n for parameterized queries

const CreateUsers = async (req, res) => {
  const { name, email, role, username, password } = req.body;

  try {
  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(password, salt);
  
  const result = await pool.query(query, [name, email, username, hash, role]);
  
  res.status(201).json({
    message: "User created successfully",
    results: result.rows[0]
  });

  } catch (err) {
  res.status(500).json({ 
    error: "Error creating user", 
    details: err.message 
  });
  }
};

module.exports = CreateUsers;
