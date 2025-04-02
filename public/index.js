const express=require("express");
const app=express();
const fSql=require("./test2")
const cors =require("cors");

app.use(express.json())
app.use(express.static("public"));
app.use(cors('*'))
const port=3002;

// API endpoint to handle SQL queries
app.post('/api/v1/query', async (req, res) => {
    const { query } = req.body;

    try {
        const response = await fSql(query);

        if (response.statusCode === 200) {
            // Success response
            res.status(200).json({
                status: 'success',
                message: "Query Executed successfully.",
                data: response.result
            });
        } else {
            // Error response
            res.status(200).json({
                status: 'error',
                message: response.error
            });
        }
    } catch (error) {
        // Internal server error
        console.error('Internal server error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal server error'
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
