import { gql } from "@apollo/client"

export const UPDATE_PROFILE = gql`
  mutation UpdateUser($fullname: String!, $file: Upload) {
      updateUser(fullname: $fullname, file: $file) {
        id
        fullname
        avatarUrl
      }
  }
`
