require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { Engine } from 'apollo-engine';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';

const env = process.env;

const engine = new Engine({
    engineConfig: {
        apiKey: env.APOLLO_CLIENT_KEY,
        logging: {
            level: 'DEBUG'
        }
    },
    graphqlPort: env.APOLLO_CLIENT_PORT,
    dumpTraffic: true
});
if (env.NODE_ENV === "production"){
  engine.start();
}

const getPosts = () => {
  return fetch(`${env.BASE_URL}${env.END_POINT_POST}`)
        .then(res => res.json())
        .then(json => json);
};

const getSocial = () => {
  return fetch(`${env.BASE_URL}${env.END_POINT_SOCIAL}?active=true`)
        .then(res => res.json())
        .then(json => {
          console.log(json)
          return json
  });
};

const getPostById = (root, params) => {
  return fetch(`${env.BASE_URL}${env.END_POINT_POST}/${params.id}`)
        .then(res => res.json())
        .then(json => json);
};

const typeDefs = `
  type Query { 
    posts: [Post],
    social: [Social],
    post(id: String!): Post
  }
 
  type Post { 
    _id: String, 
    title: String, 
    titleUrl: String,
    description: String,
    date: String,
    totalShared: String,
    imgMedium: String,
    imgLarge: String,
    imgAltLarge: String,
    content: [Paragraph]!
  }
  
  type Paragraph { 
    type: String, 
    text: String,
    img: String,
    alt: String,
    caption: String
  }
  
  type Social { 
    _id: String, 
    type: String,
    className: String,
    url: String,
    active: Boolean
  }
`;

const resolvers = {
    Query: {
      posts: getPosts,
      post: getPostById,
      social: getSocial,
    }
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
});

const app = express();

app.use(engine.expressMiddleware());

app.use(env.END_POINT_GRAPHQL, bodyParser.json(), graphqlExpress({ schema }));

app.use(env.END_POINT_GRAPHIQL, graphiqlExpress({
    endpointURL: env.END_POINT_GRAPHQL,
    tracing: true,
    cacheControl: true
}));

app.listen(env.EXPRESS_PORT, () => {
    console.log(`Running apollo server at port: ${env.EXPRESS_PORT}`);
});
