const { MongoClient, ServerApiVersion } = require('mongodb');
import { request, get } from "https";

interface User {
  id?: number;
  name?: string;
  webhook?: string;
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

  public saveUser = (id: number, data: User) => {
    async function run(instance: Model) {
      try {

        const result = await instance.users.updateOne(
          { id: id },
          {
            $set: data,
          },
          { upsert: true }
        );
        console.log(
          `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`
        );
        return result;
      } finally {
        await instance.client.close();
      }
    }
    run(this).catch(console.dir).then(() => true);
  }

  public getUser = async (id) => {
    async function run(instance): Promise<void> {
      try {
        const user = await instance.users.findOne<User>(
          { id: parseInt(id) },
        );
        if (user) {
          return user;
        }
      } finally {
        await instance.client.close();
      }
    }
    return run(this).catch(console.dir).then(user => user);
  }
}

export default Model