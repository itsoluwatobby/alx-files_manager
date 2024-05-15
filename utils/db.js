import { MongoClient } from 'mongodb';

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 27017;
const DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${HOST}:${PORT}`;

class DBClient {
  constructor() {
    this.client = new MongoClient(url, { useUnifiedTopology: true, useNewUrlParser: true });
    this.client.connect().then(() => {
      this.db = this.client.db(`${DATABASE}`);
    }).catch((err) => {
      console.log(err);
    });
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    const users = this.db.collection('users');
    const usersNum = await users.count();
    return usersNum;
  }

  async nbFiles() {
    const files = this.db.collection('files');
    const filesNum = await files.count();
    return filesNum;
  }
}

module.exports = new DBClient();
