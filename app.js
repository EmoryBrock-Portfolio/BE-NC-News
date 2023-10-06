const express = require('express');
const app = express();
const {getTopics} = require('./controllers/topics.controller.js')
const {getArticleById} = require('./controllers/articles.contoller.js')
const {handlePSQLErrors, handleCustomErrors, handle500Errors} = require('./controllers/errors.controllers.js')
const {getsiteMap} = require('./controllers/api.controller.js');
const {getArticles, getCommentsByArticleID} = require('./controllers/articles.controller.js')



// valid endpoints
//console.log(app._router.stack.filter(r=>r.route).map(r=r=>r.route.path), "current endpoints")

app.get("/api", getsiteMap)
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles)
app.get("/api/articles/:article_id", getArticleById)
app.get("/api/articles/:article_id/comments", getCommentsByArticleID)


// catch all at this stage of development
app.all('/*', (req, res, next) => {
    res.status(404).send({message: "path not found"});
})

// Error handling middleware
app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);

module.exports = app;