const express = require('express');
const router = express.Router();
const { queryDB } = require('../../db/connection');

// Fetch page content
router.get('/', (req, res) => {
    const { newsid, pageid } = req.query;

    if (!newsid || !pageid) {
        return res.status(400).json({ error: 'Missing newsid or pageid' });
    }

    const query = 'SELECT pagecontent FROM eNewsPage WHERE newsid = ? AND pageid = ?';
    queryDB(query, [newsid, pageid], (err, results) => {
        if (err) {
            console.error('Error fetching canvas data:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Canvas data not found' });
        }

        res.status(200).json({ pagecontent: results[0].pagecontent });
    });
});

// Save or update page content
router.post('/', (req, res) => {
    const { newsid, pageid, pagecontent } = req.body;

    if (!newsid || !pageid || !pagecontent) {
        return res.status(400).json({ error: 'Invalid input: Missing newsid, pageid, or pagecontent' });
    }

    const query = `
        INSERT INTO eNewsPage (newsid, pageid, pagecontent)
        VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE pagecontent = ?, updated_at = CURRENT_TIMESTAMP
    `;

    const values = [
        newsid,
        pageid,
        JSON.stringify(pagecontent),  // Store as JSON string
        JSON.stringify(pagecontent)   // Update on duplicate
    ];

    queryDB(query, values, (err, result) => {
        if (err) {
            console.error('Error saving page data:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(200).json({ message: 'Page saved successfully', newsid, pageid });
    });
});

module.exports = router;
