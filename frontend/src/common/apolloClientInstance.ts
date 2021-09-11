import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

const http = createHttpLink({
  uri: "/graphql",
});

const client = new ApolloClient({
  link: http,
  cache: new InMemoryCache(),
  credentials: "same-origin",
});

export default client;
