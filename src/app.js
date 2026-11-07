const express = require('express');

const app = express();

app.get('/index', (req, res) => {
    res.sendFile('views/index.html', { root: __dirname } )
})

module.exports = app;