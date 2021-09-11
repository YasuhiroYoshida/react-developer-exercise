import { gql } from "@apollo/client";

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    currentUser {
      id
      name
      avatar
    }
  }
`;

export { CURRENT_USER_QUERY };
