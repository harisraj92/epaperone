const express = require('express');
const router = express.Router();
const { queryDB } = require('../../db/connection');

// Fetch page content
router.get('/', (req, res) => {
    const query = 'SELECT template_id,name FROM templates'; // Add a 'name' field in the templates table

    queryDB(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch templates' });
        }

        res.json(results); // Return the list of templates
    });
});

router.get('/:template_id', (req, res) => {
    const { template_id } = req.params;
    const query = 'SELECT * FROM templates WHERE template_id = ?';

    queryDB(query, [template_id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to fetch template' });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Template not found' });
        }

        res.json(results[0]); // Return the template data
    });
});

// Save or update page content
router.post('/', (req, res) => {
    const { content } = req.body;  // Fetch content only, no template name

    // Insert the new template into the `templates` table
    const query = `
      INSERT INTO templates (content, created_at, updated_at)
      VALUES (?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `;

    queryDB(query, [content], (err, result) => {
        if (err) {
            console.error("Error inserting template:", err);
            return res.status(500).json({ error: "Failed to save template" });
        }

        res.status(201).json({ message: "Template saved successfully", template_id: result.insertId });
    });
});

router.put('/:template_id', (req, res) => {
    const templateId = req.params.template_id;
    const { name } = req.body;

    const query = 'UPDATE templates SET name = ? WHERE template_id = ?';
    queryDB(query, [name, templateId], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update template name.' });
        }
        res.json({ message: 'Template name updated successfully.' });
    });
});

module.exports = router;
