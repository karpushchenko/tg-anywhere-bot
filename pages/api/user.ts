import Model from '../includes/model'
import { NextApiResponse, NextApiRequest } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const model = new Model;
    if (req.method === 'POST') {
        if(req.body.id && req.body.data){
            const result = await model.saveUser(parseInt(req.body.id), req.body.data);
            res.status(200).send("OK");
        }
    } else if (req.method === 'GET') {
        if(req.query.id){
            const userId = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id
            const user = await model.getUser(parseInt(userId));
            res.status(200).send(user);
        }
    }
  }
  