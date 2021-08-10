import { render } from "@testing-library/react";
import Navbar from "./";
import { useQuery } from "@apollo/client";

test("renders", () => {
  render(<Navbar />);
});
