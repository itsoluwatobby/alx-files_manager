import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  getStatus(req, res) {
    return res.json({"redis":redisClient.isAlive(),"db":dbClient.isAlive()});
  }

  async getStats(req, res) {
    const nbFiles = await dbClient.nbFiles();
    const nbUsers = await dbClient.nbUsers();
    return res.json({"users":nbUsers,"files":nbFiles});
  }
}

const appController = new AppController();
export default appController;
