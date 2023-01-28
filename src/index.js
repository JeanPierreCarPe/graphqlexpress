const { ApolloServer, gql } = require("apollo-server");
const axios = require('axios');

const typeDefs = gql`
  type BreakingQuote {
    quote: String!
    author: String!
  }

  type Query {
    GetBreakingQuotes: [BreakingQuote]
    GetBreakingQuote(quote: String!): BreakingQuote
  }

  type Mutation {
    CreateBreakingQuote(quote: String!, author: String!): BreakingQuote
    DeleteBreakingQuote(quote: String!): BreakingQuote
    UpdateBreakingQuote(quote: String!, author: String!): BreakingQuote
  }
`;

let breakingQuotes = [];

const getBreakingQuotes = async ()=>{
  const response = await axios.get('https://api.breakingbadquotes.xyz/v1/quotes/10')
  const data = response.data
  breakingQuotes = data;
}

getBreakingQuotes();

const resolvers = {
  Mutation: {
    CreateBreakingQuote: (_, arg) => {
      breakingQuotes.push(arg);
      return arg;
    },
    DeleteBreakingQuote: (_, arg) => {
      let finalbreakingQuotes = breakingQuotes.filter((breakingQuote) => breakingQuote.quote != arg.quote);
      let breakingQuotedeleted = breakingQuotes.find((breakingQuote) => breakingQuote.quote == arg.quote);
      breakingQuotes = [...finalbreakingQuotes];
      return breakingQuotedeleted;
    },
    UpdateBreakingQuote: (_, arg) => {
      let objquotex = breakingQuotes.findIndex((breakingQuote) => breakingQuote.quote == arg.quote);
      breakingQuotes[objquotex] = arg;
      return arg;
    },
  },
  Query: {
    GetBreakingQuotes: () => breakingQuotes,
    GetBreakingQuote: (_, arg) => breakingQuotes.find((number) => number.quote == arg.quote),
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});