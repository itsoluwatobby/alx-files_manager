/* eslint-disable import/no-named-as-default */
import dbClient from '../../utils/db';

describe('UserController TestCases', () => {
  const mockUser = {
    email: 'beloxxi@blues.com',
    password: 'melody1982',
  };

  before((done) => {
    this.timeout(10000);
    dbClient.usersCollection()
      .then((usersCollection) => {
        usersCollection.deleteMany({ email: mockUser.email })
          .then(() => done())
          .catch((deleteErr) => done(deleteErr));
      }).catch((connectErr) => done(connectErr));
    setTimeout(done, 5000);
  });

  describe('POST: /users', () => {
    it('Fails when there is no email and there is password', (done) => {
      this.timeout(5000);
      request.post('/users')
        .send({
          password: mockUser.password,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ error: 'Missing email' });
          done();
        });
    });

    it('Fails when there is email and there is no password', (done) => {
      this.timeout(5000);
      request.post('/users')
        .send({
          email: mockUser.email,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ error: 'Missing password' });
          done();
        });
    });

    it('Succeeds when the new user has a password and email', (done) => {
      this.timeout(5000);
      request.post('/users')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect(201)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body.email).to.eql(mockUser.email);
          expect(res.body.id.length).to.be.greaterThan(0);
          done();
        });
    });

    it('Fails when the user already exists', (done) => {
      this.timeout(5000);
      request.post('/users')
        .send({
          email: mockUser.email,
          password: mockUser.password,
        })
        .expect(400)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          expect(res.body).to.deep.eql({ error: 'Already exist' });
          done();
        });
    });
  });

});

