const TelegramBot = require('node-telegram-bot-api');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const token = `1269342187:AAGPZKYDXdGswH45W-Gw1M-JJmw1TgtXLio`;

dotenv.config();
const env = process.env;

const bot = new TelegramBot(token, {polling: true});
options = {
  host: env.HOST,
  database: env.DB,
  user: env.USER,
  password: env.PASS
};

let connection = mysql.createConnection(options).promise();

bot.onText(/(.+)/, (msg, match) => {
  connection = mysql.createConnection(options).promise();
  const chatId = msg.chat.id;
  const user = '@' + msg.from.username;
  const text = msg.text;
  console.log(msg);

  connection.query('INSERT INTO queries(user, datetime, query) VALUES(?, NOW(), ?)', [user, text])
      .then((result, fields) => {
        bot.sendMessage(chatId, 'Спасибо! Ваше обращение принято.');
        console.log(result, fields);
      })
      .catch(error => {
        console.log(error);
        bot.sendMessage(chatId, 'Ошибка. Попробуйте повторить ваш вопрос позже.');
      })
      .then(() => {
        connection.end();
      })
});

connection.on('error', err => {
  console.log(err);
});

console.log(process.env.DATABASE);