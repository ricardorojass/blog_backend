const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Story} = require('../models/story');

beforeEach((done) => {
  Story.remove({}).then(() => done());
});

describe('POST / stories', () => {
  it('should create a new story', (done) => {
    title = 'Test story title';
    body = 'Test story body';

    request(app)
      .post('/stories')
      .send({title, body})
      .expect(200)
      .expect((res) => {
        expect(res.body.title).toBe(title);
        expect(res.body.body).toBe(body);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Story.find().then((stories) => {
          expect(stories.length).toBe(1);
          expect(stories[0].title).toBe(title);
          expect(stories[0].body).toBe(body);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create a story with invalid body data', (done) => {
    request(app)
      .post('/stories')
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Story.find().then((stories) => {
          expect(stories.length).toBe(0);
          done();
        }).catch((e) => done(e));
      });
  });
});