/* eslint-disable import/no-named-as-default */
import dbClient from '../../utils/db';

describe('DATABASE utility', () => {
  before(function (done) {
    this.timeout(10000);
    Promise.all([dbClient.usersCollection(), dbClient.filesCollection()])
      .then(([usersCollection, filesCollection]) => {
        Promise.all([usersCollection.deleteMany({}), filesCollection.deleteMany({})])
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
  });

  it('dbClient is alive', () => {
    expect(dbClient.isAlive()).to.equal(true);
  });

  it('return numberOfUsers', async () => {
    expect(await dbClient.nbUsers()).to.equal(0);
  });

  it('returns numberOfFiles', async () => {
    expect(await dbClient.nbFiles()).to.equal(0);
  });
});

