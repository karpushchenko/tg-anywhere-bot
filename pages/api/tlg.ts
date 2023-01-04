import { request, get } from 'https';
import Model from '../includes/model';

const processMessage = async (req, res) => {
    const tgbot = process.env.NEXT_TELEGRAM_TOKEN;
    if(!req.body.message && !req.body.edited_message) {
      console.log(req.body);
      res.status(400).send('Failed');
    }
    const message = req.body.message || req.body.edited_message;
    if (message.text === '/start') {
      const messageText =
        'Welcome to <i>NextJS News Channel</i> <b>' +
        message.from.first_name +
        '</b>.%0ATo get a list of commands sends /help';
      const ret = await fetch(
        `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${message.chat.id}&text=${messageText}&parse_mode=HTML`
      );
    }
    else if (message.text === '/help') {
      const messageText =
        'Help for <i>NextJS News Channel</i>.%0AUse /search <i>keyword</i> to search for <i>keyword</i> in my Medium publication';
      const ret = await fetch(
        `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${message.chat.id}&text=${messageText}&parse_mode=HTML`
      );
    }
    else if (message.hasOwnProperty('text')) {
      const model = new Model;
      model.getUser(message);
      const messageText = JSON.stringify(message.text);
      const ret = await fetch(
        `https://api.telegram.org/bot${tgbot}/sendMessage?chat_id=${message.chat.id}&text=${messageText}&parse_mode=HTML`
      );
    }
    res.status(200).send('OK');
  };

export default processMessage;