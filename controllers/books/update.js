const connection = require("../../utils/dbConnection");

const query = `UPDATE books SET title = $1, "totalCopies" = $2, "availableCopies" = $3 WHERE sno = $4`;

const updateBook = async (req, res) => {
    const { id } = req.params;
    let { title, totalCopies } = req.body;

    totalCopies = parseInt(totalCopies);

    if (!id || !title || !totalCopies) {
        return res.status(400).json({
            error: "Book ID, title and totalCopies are required fields"
        });
    }

    const totalCopiesInt = parseInt(totalCopies);

    try {
        // Get current book data
        const currentBook = await connection.query('SELECT * FROM books WHERE sno = $1', [id]);
        

        if (currentBook.rows.length === 0) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        // Calculate new available copies
        const book = currentBook.rows[0];
        let availableCopies = totalCopiesInt;
        
        if (book.totalcopies > 0) {
            const ratio = book.availablecopies / book.totalcopies;
            availableCopies = Math.max(0, Math.floor(ratio * totalCopiesInt));
        }

        // Update the book
        const results = await connection.query(query, [title, totalCopiesInt, availableCopies, id]);

        if (results.rowCount === 0) {
            return res.status(404).json({
                error: "Book not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Book updated successfully"
        });
    } catch (err) {
        console.error("Error updating book:", err);
        return res.status(500).json({
            error: "Error updating book in database",
            details: err.message
        });
    }
};

module.exports = updateBook;