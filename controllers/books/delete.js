const connection = require("../../utils/dbConnection");

const query = `DELETE FROM books WHERE sno = $1`;

const deleteBook = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            error: "Book ID is required"
        });
    }

    try {
        const results = await connection.query(query, [id]);
        
        if (results.rowCount === 0) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting book:", err);
        return res.status(500).json({
            error: "Error deleting book from database",
            details: err.message
        });
    }
};

module.exports = deleteBook;