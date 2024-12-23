import { DocumentNode, QueryHookOptions, useQuery } from '@apollo/client';
import { useShopifyAuth } from '../services/auth';
import { useEffect } from 'react';

export function useShopifyQuery<T = any>(
  query: DocumentNode,
  options?: QueryHookOptions<T>
) {
  const { getToken } = useShopifyAuth();
  const queryResult = useQuery(query, options);

  useEffect(() => {
    getToken();
  }, []);

  return queryResult;
}