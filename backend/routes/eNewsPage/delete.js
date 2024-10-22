// routes/eNewsPage/get.js
const express = require('express');
const router = express.Router();
const { queryDB } = require('../../db/connection');


router.delete('/:newsid', (req, res) => {
    const { newsid } = req.params;
    const query = 'DELETE FROM eNewsPage WHERE newsid = ?';

    queryDB(query, [newsid], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        // Send a single response indicating success
        return res.status(200).json({ message: 'Successfully deleted', newsid });
    });
});

module.exports = router;
