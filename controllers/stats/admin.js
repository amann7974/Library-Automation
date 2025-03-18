const connection = require("../../utils/dbConnection");

const stats = async (_req, res) => {
    try {
        // Query to get total books
        const booksQuery = "SELECT COUNT(*) as totalbooks FROM books";
        
        // Query to get total users
        const usersQuery = "SELECT COUNT(*) as totalusers FROM users";
        
        // Query to get total issued books
        const issuedBooksQuery = `
            SELECT SUM("totalCopies" - "availableCopies") as booksissued 
            FROM books
        `;

        // Execute queries using async/await
        const booksResults = await connection.query(booksQuery);
        const usersResults = await connection.query(usersQuery);
        const issuedResults = await connection.query(issuedBooksQuery);

        // Format response
        const stats = {
            totalBooks: parseInt(booksResults.rows[0].totalbooks) || 0,
            totalUsers: parseInt(usersResults.rows[0].totalusers) || 0,
            booksIssued: parseInt(issuedResults.rows[0].booksissued) || 0,
            overdue: 0 // You can add overdue logic later if needed
        };

        res.status(200).json({
            success: true,
            stats,
            message: "Stats fetched successfully"
        });

    } catch (error) {
        console.error("Error in stats controller:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
};

module.exports = stats;