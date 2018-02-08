import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { Engine } from 'apollo-engine';
const { graphqlExpress, graphiqlExpress } = require('apollo-server-express');
const { makeExecutableSchema } = require('graphql-tools');

const engine = new Engine({
    engineConfig: {
        apiKey: 'service:gh-darcusfenix:Gk5uIuiw0mYT1yDe8JR6Rw',
        logging: {
            level: 'DEBUG'
        }
    },
    graphqlPort: process.env.PORT || 3000,
    dumpTraffic: true
});

engine.start();

const getPosts = () => {
    return fetch("http://crisostomo.soy/api/posts")
        .then(res => res.json())
        .then(json => json);
};

const typeDefs = `
  type Query { posts: [Post] }
 
  type Post { 
    _id: String, 
    title: String, 
    titleUrl: String,
    description: String,
    date: String,
    totalShared: String,
    imgMedium: String,
    content: [Paragraph],
  }
  
  type Paragraph { 
    type: String, 
    text: String,
    img: String,
    alt: String,
    caption: String
  }
`;

const resolvers = {
        Query: { posts: () => getPosts() },
    };

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const app = express();

app.use(engine.expressMiddleware());

app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
    tracing: true,
    cacheControl: true
}));

app.listen(3000, () => {
    console.log('Go to http://localhost:3000/graphiql to run queries!');
});
