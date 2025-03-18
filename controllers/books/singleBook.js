const connection = require("../../utils/dbConnection");

const query = `SELECT * FROM books WHERE sno = $1`;

const fetchSingleBook = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({
            error: "Book ID is required"
        });
    }

    try {
        const results = await connection.query(query, [id]);

        if (results.rows.length === 0) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        req.book = results.rows[0];
        next();
    } catch (err) {
        console.error("Error fetching book:", err);
        return res.status(500).json({
            error: "Error fetching book from database",
            details: err.message
        });
    }
};

module.exports = fetchSingleBook;