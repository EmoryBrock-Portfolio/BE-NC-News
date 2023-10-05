const app = require('../app.js');
const db = require('../db/connection.js')
const request = require('supertest');
const seed = require('../db/seeds/seed.js')
const data = require('../db/data/test-data/index.js')

beforeEach(()=>{
    return seed(data)
})

afterAll(()=>{
 return db.end()
})

describe('GET /api/topics', () => {
    test('returns an array of topic objects of the correct format', ()=> {
        return request(app)
            .get('/api/topics')
            .expect(200)
            .then(({ body }) => {
                expect(body.topics).toHaveLength(3)
                body.topics.forEach((topic)=>{
                    expect(typeof(topic.slug)).toBe('string')
                    expect(typeof(topic.description)).toBe('string')
                })
            })
    })
})

describe('GET /api', () => {
    test('returns an object describing the valid inital TEST endpoints',() => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({ body }) => {
            const siteMap = body.mapAPI
            
            expect(typeof siteMap).toBe("object")
            expect(siteMap.hasOwnProperty('GET /api')).toBe(true)
            expect(typeof(siteMap['GET /api'].description)).toBe("string")
            expect(siteMap.hasOwnProperty('GET /api/topics')).toBe(true)
            expect(typeof(siteMap['GET /api/topics'].description)).toBe("string")
            expect(siteMap.hasOwnProperty('GET /api/articles')).toBe(true)
            expect(typeof(siteMap['GET /api/articles'].description)).toBe("string")
        })
    })
})

describe('GET /api/articles', () => {
    test('returns an array of article objects of the correct format', ()=> {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({ body }) => {
            expect(body.articles).toHaveLength(13)
            body.articles.forEach((articles)=>{
                expect(articles).toHaveProperty('author');
                expect(articles).toHaveProperty('title');
                expect(articles).toHaveProperty('article_id');
                expect(articles).toHaveProperty('topic');
                expect(articles).toHaveProperty('created_at');
                expect(articles).toHaveProperty('votes');
                expect(articles).toHaveProperty('article_img_url');
                expect(articles).toHaveProperty('comment_count');
            })
        })
    }) 
    test('returns an array of article objects in desceding order by date created', ()=>{
        return request(app)
        .get('/api/articles')
        .then(({ body }) => {
            expect(body.articles).toBeSortedBy('created_at', {descending: true,
            })
        })
    })
    test('returns an array of article objects that does not include article body', ()=> {
        return request(app)
        .get('/api/articles')
        .then(({body}) => {
            body.articles.forEach((articles)=>{
                expect(articles).not.toHaveProperty('body');
            })
        })
    })
})

describe('Endpoint general errors', () => {
    test('404 status code and error message when passed a misspelled GET /api/articles endpoint', ()=>{
        return request(app)
        .get('/api/articlez')
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe('path not found')
        })
    })
    test('404 status code and error message when passed a misspelled GET /api endpoint', ()=>{
        return request(app)
        .get("/dpi")
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe('path not found')
        })
    })
    test('404 status code and error message when passed a misspelled GET /api/topics endpoint', ()=>{
        return request(app)
            .get("/api/topicz")
            .expect(404)
            .then(({body})=> {
                expect(body.message).toBe('path not found')
            })
        })
})

describe('GET /api/articles/:article_id/comments', () => {
    test('returns an array of comment object(s) of the queried article in the correct format', ()=> {
        return request(app)
        .get('/api/articles/3/comments')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toBeSortedBy('created_at', {descending: true,})
            body.forEach((comment)=>{
                expect(comment).toHaveProperty('comment_id');
                expect(comment).toHaveProperty('votes');
                expect(comment).toHaveProperty('created_at');
                expect(comment).toHaveProperty('author');
                expect(comment).toHaveProperty('body');
                expect(comment).toHaveProperty('article_id');    
            })
        })
    })
    test('returns an empty array if article id does exist but does not have comments', ()=> {
        return request(app)
        .get('/api/articles/13/comments')
        .expect(200)
        .then(({ body }) => {
            expect(Array.isArray(body)).toBe(true)
            expect(body).toEqual([])
            })
     })
    test('returns a 400 if an invalid article_id is provided', ()=>{
        return request(app)
        .get('/api/articles/three/comments')
        .expect(400)
        .then(({body})=> {
            expect(body.message).toBe(`bad request`)
            })
    })
    test('returns a 404 if passed an article_id that does not exist in the database', ()=>{
        return request(app)
        .get('/api/articles/9999/comments')
        .expect(404)
        .then(({body})=> {
            expect(body.message).toBe(`No article found for id 9999`)
            })
    })
})
        