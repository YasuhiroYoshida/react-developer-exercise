import { render, screen } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";
import * as graphql from "./graphql";
import App from "./App";

test("renders the page title common across pages", () => {
  render(
    <ApolloProvider client={graphql.client}>
      <App />
    </ApolloProvider>
  );
  const titleElement = screen.getByText(/GoodGym Developer Exercise/i);
  expect(titleElement).toBeInTheDocument();
});
