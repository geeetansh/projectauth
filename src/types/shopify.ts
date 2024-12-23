export interface ShopifyPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor?: string;
  endCursor?: string;
}

export interface ShopifyConnection<T> {
  edges: Array<{
    node: T;
    cursor: string;
  }>;
  pageInfo: ShopifyPageInfo;
}