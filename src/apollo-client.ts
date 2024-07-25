import fetch from 'cross-fetch'
import { GraphQLClient } from 'graphql-request'
import { setContext } from '@apollo/client/link/context'
import { ApolloClient, InMemoryCache, createHttpLink, Resolvers, gql } from '@apollo/client'
import { onError } from '@apollo/client/link/error'
// import { buildTypeDefsAndResolvers } from 'type-graphql'
import config from './config'

const errorLink = onError(({ graphQLErrors, networkError }: any) => {
  if (graphQLErrors)
    graphQLErrors.forEach(({ message, locations, path }: any) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${path}`
      )
    )
  if (networkError) console.log(`[Network error]: ${networkError}`)
})

export default async function createApolloClient() {
  const endpoint = config.serviceUri

  const getAuthHeader = () => {
    const token = localStorage.getItem(config.tokenKey)
    const loginAsUser = localStorage.getItem('LoginAs')

    if (!token) return {}

    const headers: any = {
      authorization: `Bearer ${token}`,
    }

    if (loginAsUser) headers['x-login-as'] = loginAsUser

    return headers
  }

  /** [EXPERIMENTAL] Apollo client setup */
  const httpLink = createHttpLink({
    uri: endpoint,
    fetch,
  })

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...getAuthHeader(),
      },
    }
  })

  // const { typeDefs, resolvers } = await buildTypeDefsAndResolvers({
  //   resolvers: [] as any,
  //   skipCheck: true, // allow for schema without queries
  // })

  const client = new ApolloClient({
    link: authLink.concat(errorLink).concat(httpLink),
    cache: new InMemoryCache(),
    // typeDefs,
    // resolvers: resolvers as Resolvers,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
      mutate: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all',
      },
    },
  })

  return client
}
