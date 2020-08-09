const restify = require('restify');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const corsMiddleware = require('restify-cors-middleware');
dotenv.config();

const env = process.env;
const options = {
  host: env.HOST,
  database: env.DB,
  user: env.USERNAME,
  password: env.PASS
};

const cors = corsMiddleware({});

const server = restify.createServer();

server.use(cors.preflight);
server.use(cors.actual);

server.get('/api', (req, res, next) => {
  const connection = mysql.createConnection(options);
  connection.query('SELECT * FROM queries', (err, results, fields) => {
    if (err) {
      console.error(err);
      next();
    } else {
      res.send(results);
      next();
    }
    connection.end();
    next();
  })
});

server.listen(1234, function () {
  console.log('%s listening at %s', server.name, server.url);
});