import { gql } from "@apollo/client";

const SESSIONS_QUERY = gql`
  query Sessions {
    sessions {
      id
      title
      strapline
      image
      startTime
      signups {
        user: id
        name
        avatar
      }
    }
  }
`;

export { SESSIONS_QUERY };
