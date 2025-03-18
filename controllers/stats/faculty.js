const connection = require("../../utils/dbConnection");

const facultyStats = async (req, res) => {
    try {
        const facultyId = req.decoded.id;

        // Query to get total borrowed books
        const borrowedQuery = "SELECT COUNT(*) as totalBorrowed FROM issued_books WHERE faculty_id = $1 AND returned = false";
        
        // Query to get books due soon (within 7 days)
        const dueSoonQuery = `
            SELECT COUNT(*) as dueSoon 
            FROM issued_books 
            WHERE faculty_id = $1 
            AND returned = false 
            AND due_date BETWEEN NOW() AND NOW() + INTERVAL '7 days'
        `;
        
        // Query to get current books
        const currentBooksQuery = `
            SELECT b.title, b.author, i.issue_date, i.due_date 
            FROM issued_books i 
            JOIN books b ON i.book_id = b.sno 
            WHERE i.faculty_id = $1 AND i.returned = false
            ORDER BY i.due_date ASC
        `;

        // Execute queries using async/await
        const borrowedResults = await connection.query(borrowedQuery, [facultyId]);
        const dueSoonResults = await connection.query(dueSoonQuery, [facultyId]);
        const currentBooks = await connection.query(currentBooksQuery, [facultyId]);

        // Get recommended books
        const recommendedQuery = `
            SELECT sno, title, author, "availableCopies" 
            FROM books 
            WHERE "availableCopies" > 0 
            ORDER BY RANDOM() 
            LIMIT 4
        `;

        const recommendedBooks = await connection.query(recommendedQuery);

        // Format response
        const stats = {
            totalBorrowed: parseInt(borrowedResults.rows[0].totalborrowed) || 0,
            dueSoon: parseInt(dueSoonResults.rows[0].duesoon) || 0,
            currentBooks: currentBooks.rows || [],
            recommendedBooks: recommendedBooks.rows || []
        };

        res.status(200).json({
            success: true,
            stats,
            message: "Faculty stats fetched successfully"
        });

    } catch (error) {
        console.error("Error in faculty stats controller:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message
        });
    }
};

module.exports = facultyStats;
