/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: Sessions
// ====================================================

export interface Sessions_sessions_signups {
  __typename: "User";
  user: string;
  name: string;
  avatar: string;
}

export interface Sessions_sessions {
  __typename: "Session";
  id: string;
  title: string;
  strapline: string;
  image: string;
  startTime: any;
  signups: Sessions_sessions_signups[];
}

export interface Sessions {
  sessions: Sessions_sessions[];
}
