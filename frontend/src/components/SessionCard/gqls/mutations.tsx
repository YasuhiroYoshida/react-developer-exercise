import { gql } from "@apollo/client";

export const REGISTER_SESSION_MUTATION = gql`
  mutation Register($sessionId:ID!) {
    register(sessionId:$sessionId) {
      session {
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
  }
`;

export const UNREGISTER_SESSION_MUTATION = gql`
  mutation Unregister($sessionId:ID!) {
    unregister(sessionId:$sessionId)
  }
`;
