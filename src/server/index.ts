import express = require('express');
const server = express();
const port = 8080;

server.use(express.static('dist/client'));
server.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));