const bcrypt = require("bcrypt");
const saltRounds = 10;
const connection = require("../../utils/dbConnection");

const query = `INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)`;

const CreateUsers = (req, res) => {
  const { name, email, role, username, password } = req.body;

  bcrypt.genSalt(saltRounds, function (err, salt) {
    bcrypt.hash(password, salt, function (err, hash) {
      if (err) {
        return res.status(500).json({ error: "Error hashing password", err });
      }
      connection.query(
        query,
        [name, email, username, hash, role],
        (err, results) => {
          if (err) {
            return res.status(500).json({ error: "Error creating user", err });
          }
          res
            .status(201)
            .json({ message: "User created successfully", results });
        }
      );
    });
  });
};

module.exports = CreateUsers;
