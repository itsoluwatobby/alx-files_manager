/* eslint-disable class-methods-use-this */
import Queue from 'bull';
import sha1 from 'sha1';
import { ObjectID } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const userQueue = new Queue('userQueue', 'redis://127.0.0.1:6379');

class UsersController {
  postNew(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: `Missing ${email ? 'password' : 'email'}` });
    }
    const encryptPass = sha1(password);
    const userModel = dbClient.db.collection('users');
    // get duplicate
    userModel.findOne({ email }, (err, data) => {
      if (err) return res.status(400).json({ error: err.message });
      if (data) return res.status(400).json({ error: 'Already exist' });
      userModel.insertOne({ email, password: encryptPass })
        .then((newUser) => {
          res.status(200).json({ id: newUser.insertedId, email });
          userQueue.add({ userId: result.insertedId });
          return;
        }).catch((error) => return res.sendStatus(500));
    });
  }

  async getMe(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);
    if (userId) {
      const users = dbClient.db.collection('users');
      const idObject = new ObjectID(userId);
      users.findOne({ _id: idObject }, (err, user) => {
        if (user) {
          return res.status(200).json({ id: userId, email: user.email });
        } 
        return res.status(401).json({ error: 'Unauthorized' });
      });
    } else {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  }
}

const usersController = new UsersController();
export default usersController;
