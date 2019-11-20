const express = require("express");
const app = express();
const port = 3000;
const path = require('path')

app.get('/favicon.ico', function(req, res) {
    res.type('image/svg+xml');
    res.sendFile('/favicon.svg', {
        root: path.join(__dirname),
    });
})
app.use(express.static("./dist/"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
