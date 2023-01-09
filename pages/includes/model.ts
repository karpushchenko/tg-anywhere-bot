const { MongoClient } = require('mongodb');
import { User } from './types'

class Model {
  private uri = process.env.MONGODB_URI;
  private db_name = process.env.MONGODB_DB;
  private client;
  private database
  private users;
  constructor() {
    this.client = new MongoClient(this.uri);
    this.database = this.client.db(this.db_name);
    this.users = this.database.collection("users");
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

  public getUser = async (id:number):Promise<false | User> => {
    async function run(instance: Model): Promise<false | User> {
      try {
        const user = await instance.users.findOne(
          { id: id },
        );
        if (user) {
          return user;
        } else {
          return false;
        }
      } finally {
        await instance.client.close();
      }
    }
    const user: false | User =  await run(this).catch(() => {return false}).then(user => user)
    return user;
  }
}

export default Model