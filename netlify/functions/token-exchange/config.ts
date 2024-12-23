export const config = {
  headers: {
    cors: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    },
    json: {
      'Content-Type': 'application/json'
    }
  },
  shopify: {
    tokenEndpoint: (shop: string) => `https://${shop}/admin/oauth/access_token`
  }
};