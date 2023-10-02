const app = require('../app.js');
const db = require('../db/connection.js')
const request = require('supertest');
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
 db.end()
})


describe('GET /api/topics', () => {
    test('responds with a 200 status code', () => {
        return request(app).get('/api/topics').expect(200);
    })
    test('returns an array of topic objects of the correct format', ()=> {
        return request(app)
            .get('/api/topics')
            .then(({ body }) => {
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic)=>{
                    expect(typeof(topic.slug)).toBe('string')
                    expect(typeof(topic.description)).toBe('string')
                })
            })
    })
})