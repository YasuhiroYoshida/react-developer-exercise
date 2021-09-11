import { render, screen } from "@testing-library/react";
import { ApolloProvider } from "@apollo/client";
import client from "./common/apolloClientInstance";
import App from "./App";

test("renders the page title common across pages", () => {
  render(
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
  const titleElement = screen.getByText(/GoodGym Developer Exercise/i);
  expect(titleElement).toBeInTheDocument();
});
