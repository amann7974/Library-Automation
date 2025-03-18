const { parse } = require("dotenv");
const connection = require("../../utils/dbConnection");

const query = `INSERT INTO books (title, "totalCopies", "availableCopies") 
               VALUES ($1, $2, $3) RETURNING sno`;

const addBook = async (req, res, next) => {
    let { title, totalCopies } = req.body;
    totalCopies = parseInt(totalCopies);
    

    // console.log(req.body);
    

    if(!title || !totalCopies) {
        return res.status(400).json({
            error: "Title and totalCopies are required fields"
        });
    }

    const availableCopies = totalCopies; 

    try {
        const results = await connection.query(query, [title, totalCopies, availableCopies]);
        req.bookId = results.rows[0].sno;
        next();
    } catch (err) {
        console.error("Error adding book:", err);
        return res.status(500).json({
            error: "Error adding book to database",
            details: err.message
        });
    }
};

module.exports = addBook;