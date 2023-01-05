import Model from '../includes/model'

export default async function handler(req, res) {
    const model = new Model;
    if (req.method === 'POST') {
        if(req.body.id && req.body.data){
            const result = await model.saveUser(parseInt(req.body.id), req.body.data);
            res.status(200).send("OK");
        }
    } else if (req.method === 'GET') {
        if(req.query.id){
            const user = await model.getUser(req.query.id);
            res.status(200).send(user);
        }
    }
  }
  