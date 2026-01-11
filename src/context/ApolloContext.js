import { ApolloClient } from '@apollo/client/core/ApolloClient';
import { InMemoryCache } from '@apollo/client/cache';
import { createHttpLink } from '@apollo/client/link/http';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';

// URL de l'API GraphQL (à remplacer par votre URL réelle)
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Remplacez par l'URL de votre API GraphQL
  credentials: 'same-origin', // Important pour les cookies d'authentification
});

// Gestion des erreurs
const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path }) =>
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
    );
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// Configuration de l'en-tête d'autorisation si nécessaire
const authLink = setContext((_, { headers }) => {
  // Récupérer le jeton d'authentification du stockage local s'il existe
  const token = localStorage.getItem('token');
  
  // Retourner les en-têtes avec le jeton d'authentification s'il existe
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

// Création du client Apollo
const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
});

export default client;
