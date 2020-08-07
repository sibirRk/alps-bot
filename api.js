const restify = require('restify');
const mysql = require('mysql2');
const dotenv = require('dotenv');
dotenv.config();

const env = process.env;
const options = {
  host: env.HOST,
  database: env.DB,
  user: env.USERNAME,
  password: env.PASS
};

const server = restify.createServer();
const connection = mysql.createConnection(options).promise();

server.get('/api', (req, res, next) => {
  connection.query('SELECT * FROM queries')
      .then(([rows, fields]) => {
        res.send(rows);
        return next()
      })
      .catch(error => {
        console.log(error);
      })
      .then(() => {
        connection.end();
      });
});

server.listen(1234, function () {
  console.log('%s listening at %s', server.name, server.url);
});