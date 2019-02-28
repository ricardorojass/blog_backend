const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Story} = require('../models/story');

const stories = [
  {
    title: 'First story title',
    body: 'First story body'
  },
  {
    title: 'Second story title',
    body: 'Second story body'
  },
];

beforeEach((done) => {
  Story.remove({}).then(() => {
    return Story.insertMany(stories);
  }).then(() => done());
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

        Story.find({title, body}).then((stories) => {
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
          expect(stories.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /stories', () => {
  it('should get all stories', (done) => {
    request(app)
      .get('/stories')
      .expect(200)
      .expect((res) => {
        expect(res.body.stories.length).toBe(2);
      })
      .end(done);
  })
});

describe('GET /stories/:title', () => {
  it('should return story doc', (done) => {
    request(app)
      .get(`/stories/${stories[0].title}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.story.title).toBe(stories[0].title);
      })
      .end(done);
  });

  it('should return 404 if story doc not found ', (done) => {
    request(app)
      .get('/stories/faketitle')
      .expect(404)
      .end(done);
  });
});