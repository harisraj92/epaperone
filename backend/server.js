const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(cors()); // Enable CORS for all routes

// Enable body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Import routes
const geteNewsPage = require('./routes/eNewsPage/get');
const posteNewsPage = require('./routes/eNewsPage/post');
const deleteeNewsPage = require('./routes/eNewsPage/delete');
const newstitle = require('./routes/Designlayout/newstitle');
const pagecontent = require('./routes/Designlayout/pagecontent');
const template = require('./routes/Designlayout/template')
const uploadImage = require('./routes/Designlayout/uploadImage'); // Import the uploadImage route

// Use routes
app.use('/api/newslist', geteNewsPage);
app.use('/api/addmainpage', posteNewsPage);
app.use('/api/deletemainpage', deleteeNewsPage);
app.use('/api/newstitle', newstitle);
app.use('/api/pagecontent', pagecontent);
app.use('/api/template', template);
app.use('/api/uploadImage', uploadImage); // Register the image upload route

app.use((req, res, next) => {
    console.log(`Request for: ${req.url}`);
    next();
});
// Serve static files from 'public/images'
app.use('/Images', express.static(path.join(__dirname, 'public/Images'), {
    setHeaders: function (res, path) {
        res.setHeader('Access-Control-Allow-Origin', '*');
    }
}));

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store');
    next();
});


const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
