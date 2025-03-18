const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const pool = require("../../utils/dbConnection"); // Assuming you've updated your database connection to use pg

const query = 'SELECT * FROM users WHERE username = $1 AND role = \'faculty\'';

const loginUserFaculty = async (req, res) => {
  const { username, password } = req.body;
  console.log(req.body);

  try {
    const results = await pool.query(query, [username]);

    if (results.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = results.rows[0];
    console.log(user.username, username);

    if (user.username === username) {
      const match = await bcrypt.compare(password, user.password);
      
      if (!match) {
        return res.status(401).json({ error: "Invalid Password" });
      }

      const token = jwt.sign(
        {
          username,
          role: user.role,
        },
        process.env.JWT_SECRET
      );
      
      res.cookie("accesstoken", token, { httpOnly: true });
      return res.status(200).json({ message: "Login successful" });
    } else {
      return res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error finding user", err });
  }
};

module.exports = loginUserFaculty;
