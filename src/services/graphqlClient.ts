import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { TokenStorage } from './auth/storage';

const httpLink = createHttpLink({
  uri: '/api/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  const token = TokenStorage.get();
  
  return {
    headers: {
      ...headers,
      'X-Shopify-Access-Token': token?.accessToken || '',
    },
  };
});

export const createApolloClient = () => {
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
      },
    },
  });
};