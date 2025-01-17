const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/db');  

const app = express();
const port = 3000;


app.use(bodyParser.json());


app.get('/todos', async (req, res) => {
    try {
        const [rows] = await db.execute('SELECT * FROM todos');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.post('/todos', async (req, res) => {
    const { title, completed } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO todos (title, completed) VALUES (?, ?)', 
            [title, completed]
        );
        res.json({ id: result.insertId, title, completed });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.get('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await db.execute('SELECT * FROM todos WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.put('/todos/:id', async (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;

    console.log('Received PUT request for Todo:', id, completed);

    
    if (typeof completed !== 'number' || (completed !== 0 && completed !== 1)) {
        console.log('Invalid completed value:', completed);
        return res.status(400).json({ error: 'Invalid value for completed. It must be 0 or 1.' });
    }

    try {
        
        console.log('Executing SQL query with parameters:', [completed, id]);

        const [result] = await db.execute(
            'UPDATE todos SET completed = ? WHERE id = ?',
            [completed, id]
        );

        console.log('SQL query result:', result);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }

        res.json({ id, completed });
    } catch (error) {
        console.error('Error executing SQL query:', error.message);
        res.status(500).json({ error: error.message });
    }
});






app.delete('/todos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.execute('DELETE FROM todos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Todo not found' });
        }
        res.json({ message: 'Todo deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
