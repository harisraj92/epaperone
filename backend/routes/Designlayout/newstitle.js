
const express = require('express');
const router = express.Router();
const { queryDB } = require('../../db/connection');

router.get('/:newsid', (req, res) => {
    const { newsid } = req.params;
    const query = 'SELECT newstitle FROM eNewsPage WHERE newsid = ?';

    queryDB(query, [newsid], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'No title found' });
        }

        res.status(200).json(results[0]);
    });

})

router.put('/:newsid', (req, res) => {
    const { newsid } = req.params;
    const { newstitle } = req.body;

    if (!newstitle) {
        return res.status(400).json({ error: 'New title is required' });
    }

    const query = 'UPDATE eNewsPage SET newstitle = ? WHERE newsid = ?';

    queryDB(query, [newstitle, newsid], (err) => {
        if (err) {
            console.error('Error updating title:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        res.status(200).json({ message: 'Title updated successfully' });
    });

})






module.exports = router;