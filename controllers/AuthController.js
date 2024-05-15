/* eslint-disable consistent-return */
import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  static getConnect(req, res) {
    const authData = req.headers.authorization;
    let userEmail = authData.split(' ')[1];
    const buff = Buffer.from(userEmail, 'base64');
    userEmail = buff.toString('ascii');
    // userEmail contains the <emai>:<password>
    const data = userEmail.split(':');
    if (data.length !== 2) return res.status(401).json({ error: 'Unauthorized' });
    const hashedPassword = sha1(data[1]);
    const userModel = dbClient.db.collection('users');
    userModel.findOne({ email: data[0], password: hashedPassword }, async (err, user) => {
      if (user) {
        const token = uuidv4();
        const key = `auth_${token}`;
        await redisClient.set(key, user._id.toString(), 60 * 60 * 24);
        return res.status(200).json({ token });
      }
      return res.status(401).json({ error: 'Unauthorized' });
    });
  }

  static async getDisconnect(req, res) {
    const token = req.header('X-Token');
    const key = `auth_${token}`;
    const id = await redisClient.get(key);
    if (id) {
      await redisClient.del(key);
      return res.status(204).json({});
    }
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

export default AuthController;
