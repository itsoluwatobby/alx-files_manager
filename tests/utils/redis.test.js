/* eslint-disable import/no-named-as-default */
import { expect } from 'chai';
import redisClient from '../../utils/redis';

describe('RedisClient utility', () => {
  before(function (done) {
    this.timeout(10000);
    setTimeout(done, 4000);
  });

  it('redisClient is alive', () => {
    expect(redisClient.isAlive()).to.equal(true);
  });

  it('+ Set and get value', async function () {
    await redisClient.set('v_key', 5, 10);
    expect(await redisClient.get('v_key')).to.equal('5');
  });

  it('Set and get expired value', async function () {
    await redisClient.set('v_key', 20, 1);
    setTimeout(async () => {
      expect(await redisClient.get('v_key')).to.not.equal('20');
    }, 3000);
  });

  it('Set and get deleted value', async function () {
    await redisClient.set('v_key', 345, 10);
    await redisClient.del('v_key');
    setTimeout(async () => {
      expect(await redisClient.get('v_key')).to.be.null;
    }, 2000);
  });
});

