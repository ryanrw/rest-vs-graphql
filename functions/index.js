const functions = require("firebase-functions");
const { ApolloServer, gql } = require("apollo-server-cloud-functions");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const data = require("./data");

const app = express();

app.use(cors());
app.use(bodyParser());

app.get("/", (req, res) => {
  try {
    res.send({ data });
  } catch (e) {
    res.status(500).send({ error: "server error" });
  }
});

const typeDefs = gql`
  enum Sex {
    M
    F
  }

  type Person {
    name: String!
    age: Int!
    sex: Sex!
  }

  type Query {
    data: [Person]!
  }
`;

const resolvers = {
  Query: {
    data: () => data
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true
});

exports.rest = functions.https.onRequest(app);
exports.api = functions.https.onRequest(
  server.createHandler({
    cors: {
      origin: "*",
      credentials: true
    }
  })
);
