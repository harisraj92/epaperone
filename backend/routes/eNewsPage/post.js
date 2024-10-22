// routes/eNewsPage/get.js
const express = require('express');
const router = express.Router();
const { queryDB } = require('../../db/connection');

router.post('/', (req, res) => {
    const { newstitle, pagecontent } = req.body;

    const getMaxNewsIdQuery = 'SELECT MAX(newsid) as maxNewsId FROM eNewsPage';

    queryDB(getMaxNewsIdQuery, [], (err, result) => {
        if (err) {
            console.error('Error fetching max newsid:', err);
            return res.status(500).json({ error: 'Database error' });
        }

        let newsid = (result[0].maxNewsId || 0) + 1;

        const getMaxPageIdQuery = 'SELECT MAX(pageid) as maxPageId FROM eNewsPage WHERE newsid = ?';
        queryDB(getMaxPageIdQuery, [newsid], (err, result) => {
            if (err) {
                console.error('Error fetching max pageid:', err);
                return res.status(500).json({ error: 'Database error' });
            }

            let pageid = (result[0].maxPageId || 0) + 1;

            const insertQuery = 'INSERT INTO eNewsPage (newsid, pageid, pagecontent, newstitle) VALUES (?, ?, ?, ?)';
            const values = [newsid, pageid, pagecontent || null, newstitle || 'Untitled ePage'];

            queryDB(insertQuery, values, (err, result) => {
                if (err) {
                    console.error('Error saving page data:', err);
                    return res.status(500).json({ error: 'Database error' });
                }

                res.status(200).json({ message: 'Page saved successfully', newsid, pageid });
            });
        });
    });

})


module.exports = router;