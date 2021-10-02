const { ApolloServer, gql } = require('apollo-server-lambda')
var faunadb = require('faunadb');
let q = faunadb.query;

const typeDefs = gql`
  type Query {
    todos: [Todo!]
  }
  type Mutation {
    addTodo(task: String!): Todo
  }
  type Todo {
    id: ID!
    task: String!
    status: Boolean!
  }
`

const resolvers = {
  Query: {
    todos: async (root, args, context) => {
      try {
        var adminClient = new faunadb.Client({
          secret: "fnAEUcOFSLAAQ8VAgf02SRa7uDSxHvszaA8COAEn",
          domain: 'db.us.fauna.com',
          scheme: 'https',
        });
        const result = await adminClient.query(
          q.Map(
            q.Paginate(q.Documents(q.Collection('posts'))),
            q.Lambda(x => q.Get(x))
          )
        )

        // console.log("query: ");
        // console.log(result.data)

        return result.data.map(d => {
          return {
            id: d.ts,
            status: d.data.status || false,
            task: d.data.task || "no task"
          }
        })
      }
      catch (err) {
        console.log(err)
      }
    }
  },
  Mutation: {
    addTodo: async (_, { task }) => {
      try {
        var adminClient = new faunadb.Client({
          secret: "fnAEUcOFSLAAQ8VAgf02SRa7uDSxHvszaA8COAEn",
          domain: 'db.us.fauna.com',
          scheme: 'https',
        });
        const result = await adminClient.query(
          q.Create(
            q.Collection('posts'),
            {
              data: {
                task: task,
                status: true
              }
            },
          )
        )
        // console.log("mutation: ");
        // console.log(result.ref);
        return result.ref.data;
      }
      catch (err) {
        console.log(err)
      }
    },

    // deleteTodo: async (_, { task }) => {
    //   try {
    //     var adminClient = new faunadb.Client({
    //       secret: "fnAEUcOFSLAAQ8VAgf02SRa7uDSxHvszaA8COAEn",
    //       domain: 'db.us.fauna.com',
    //       scheme: 'https',
    //     });
    //     const result = await adminClient.query(
    //       q.Delete(
    //         q.Ref(q.Collection('posts'), task)
    //       )
    //     )
    //     // console.log("mutation: ");
    //     // console.log(result.ref);
    //     return result.ref.data;
    //   }
    //   catch (err) {
    //     console.log(err)
    //   }
    // },

  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

exports.handler = server.createHandler()
