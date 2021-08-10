/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL mutation operation: Register
// ====================================================

export interface Register_register_session_signups {
  __typename: "User";
  user: string;
  name: string;
  avatar: string;
}

export interface Register_register_session {
  __typename: "Session";
  id: string;
  title: string;
  strapline: string;
  image: string;
  startTime: any;
  signups: Register_register_session_signups[];
}

export interface Register_register {
  __typename: "Registration";
  session: Register_register_session;
}

export interface Register {
  register: Register_register;
}

export interface RegisterVariables {
  sessionId: string;
}
