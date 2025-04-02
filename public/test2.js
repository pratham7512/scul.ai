const { Client } = require('pg');

const fSql = async function (query) {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        database: 'f_sql',
        user: 'postgres',
        password: 'nocturnal45$yu',
    });

    const response = {
        statusCode: 200, // Default status code indicating success
        result: null,
        error: null
    };

    try {
        await client.connect();
        const result = await client.query(query);
        response.result = result.rows; // Assuming you want to return the rows
    } catch (error) {
        console.error('Error executing query:', error);
        response.statusCode = 500; // Set status code for error
        if (error.detail) {
            response.error = error.detail; // Specific error message if available
        } else if (error.message) {
            response.error = error.message; // General error message if no detail
        } else {
            response.error = 'Error executing query'; // Fallback generic error message
        }
    } finally {
        await client.end();
    }

    return response;
}

module.exports = fSql;
