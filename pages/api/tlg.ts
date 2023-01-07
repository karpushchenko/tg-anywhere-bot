import { request, get } from 'https';
import Model from '../includes/model';
import axios from 'axios';
const querystring = require('node:querystring');

const prepareSchema = (schema:string, message) => {
  schema = schema.replaceAll('$firstName', message.from.first_name);
  schema = schema.replaceAll('$lastName', message.from.last_name);
  schema = schema.replaceAll('$MessageText', querystring.escape(message.text));
  schema = schema.replaceAll('$MessageDate', message.date);
  return JSON.parse(schema);
}

const processMessage = async (req, res) => {
    const tgbot = process.env.NEXT_TELEGRAM_TOKEN;
    if(!req.body.message && !req.body.edited_message) {
      res.status(400).send('Failed');
    }
    const message = req.body.message || req.body.edited_message;
    if (message.text && message.text === '/start') {
      const messageText =
        'Welcome to <i>Telegram Anywhere</i> integration bot<b>, ' +
        message.from.first_name +
        '</b>.%0ATo get a list of commands sends /help';
        message.from.id
      const model = new Model();
      const data = {
        name: `${message.from.first_name} ${message.from.last_name}`,
      };
      model.saveUser(message.from.id, data);
      const ret = await fetch(
        `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${message.chat.id}&text=${messageText}&parse_mode=HTML`
      );

      const buttonObj = {
        type: 'web_app',
        text: 'Update Settings',
        web_app: {
          url: `https://${req.headers.host}/settings`,
        }
      }
      const buttonRet = await fetch(
        `https://api.telegram.org/bot${tgbot}/setChatMenuButton?chat_id=${message.chat.id}&menu_button=${JSON.stringify(buttonObj)}`
      );
    }
    else if (message.text && message.text === '/help') {
      const messageText =
        'Help for <i>Telegram Anywhere</i>.%0AUse /start <i>keyword</i> to initialize the bot with the latest data';
      const ret = await fetch(
        `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${message.chat.id}&text=${messageText}&parse_mode=HTML`
      );
    }
    else if (message.text) {
      const model = new Model;
      const user = await model.getUser(message.from.id);
      if(user.webhook && user.schema){
        const data = prepareSchema(user.schema, message);
        axios.post(user.webhook, data).then(
          async () => {
            const messageText = `Successfully submitted to ${user.webhook}`;
            const ret = await fetch(
              `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${message.chat.id}&text=${messageText}&parse_mode=HTML`
            );
          }
        )
      }
    }
    res.status(200).send('OK');
  };

export default processMessage;