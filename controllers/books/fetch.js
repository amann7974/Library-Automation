const connection = require("../../utils/dbConnection");

const query = `SELECT * FROM books`;

const fetchBooks = async (req, res, next) => {
    try {
        const results = await connection.query(query);
        req.books = results.rows;
        next();
    } catch (err) {
        console.error("Error fetching books:", err);
        return res.status(500).json({
            error: "Error fetching books from database",
            details: err.message
        });
    }
};

module.exports = fetchBooks;