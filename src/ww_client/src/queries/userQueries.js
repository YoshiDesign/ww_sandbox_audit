import { gql } from 'apollo-boost';

// User Sign-Up
const addUserMutation = gql`
  mutation ($name: String!, $pass: String!, $email: String!){
    addUser(name: $name, pass: $pass, email: $email){
      name
      email
    }
  }
`

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

export {SIGNUP_MUTATION, LOGIN_MUTATION}