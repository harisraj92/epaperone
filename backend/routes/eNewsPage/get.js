// routes/eNewsPage/get.js
const express = require('express');
const router = express.Router();
const { queryDB } = require('../../db/connection');

// GET API to fetch news data
router.get('/', (req, res) => {
    const sql = `
   SELECT newstitle, updated_at, count(pageid) as pages, pageid, newsid
      FROM eNewsPage
      GROUP BY newsid
  `;

    queryDB(sql, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send(err);
            return;
        }
        res.json(result); // Send the query result as JSON response
    });
});

module.exports = router;
