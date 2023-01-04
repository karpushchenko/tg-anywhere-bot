const { MongoClient, ServerApiVersion } = require('mongodb');
import { request, get } from "https";

interface User {
  id: string;
  name: string;
  endpoint?: string;
}

class Model {
  private uri = process.env.MONGODB_URI;
  private db_name = process.env.MONGODB_DB;
  private client;
  private database
  private users;
  constructor() {
    this.client = new MongoClient(this.uri);
    this.database = this.client.db(this.db_name);
    this.users = this.database.collection<User>("users");
  }

  public saveUser = (message) => {
    async function run(instance) {
      try {

        const result = await instance.users.updateOne(
          { id: message.from.id },
          {
            $set: {
              name: `${message.from.first_name} ${message.from.last_name}`,
              endpoint: process.env.ENDPOINT,
            },
          },
          { upsert: true }
        );
        console.log(
          `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        );
      } finally {
        await instance.client.close();
      }
    }
    run(this).catch(console.dir);
  }

  public getUser = (message) => {
    async function run(instance): Promise<void> {
      try {
        const user = await instance.users.findOne<User>(
          { id: message.from.id },
        );
        console.log(user);
        if (user && user.endpoint) {
          get(user.endpoint, res => {

            const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            console.log('Status Code:', res.statusCode);
            console.log('Date in Response header:', headerDate);

            res.on('data', chunk => {
              console.log(chunk)
            });

            res.on('end', () => {
              console.log('Response ended: ');
            });
          }).on('error', err => {
            console.log('Error: ', err.message);
          });
        }
      } finally {
        await instance.client.close();
      }
    }
    run(this).catch(console.dir);
  }
}

export default Model