const http = require('http');
const mongoose = require('mongoose');
const { handleRequest } = require('./routes');
require('dotenv').config({ path: `./.env` });
const url = process.env.DBURL || 'mongodb://localhost:27017/WebShopDb';
mongoose.connect(url, {useNewUrlParser: true});
const PORT = process.env.PORT || 3000;
const server = http.createServer(handleRequest);

server.on('error', err => {
  console.error(err);
  server.close();
});

server.on('close', () => console.log('Server closed.'));

server.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});
