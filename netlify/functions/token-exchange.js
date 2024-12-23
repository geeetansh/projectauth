const { success, badRequest, methodNotAllowed, serverError } = require('./utils/response');

const handler = async (event) => {
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return success({});
  }

  if (event.httpMethod !== 'POST') {
    return methodNotAllowed();
  }

  try {
    const { shop, code } = JSON.parse(event.body || '{}');
    
    if (!shop || !code) {
      return badRequest('Missing required parameters: shop and code');
    }

    const response = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.VITE_SHOPIFY_API_KEY,
        client_secret: process.env.VITE_SHOPIFY_CLIENT_SECRET,
        code,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Shopify API error:', errorText);
      return serverError('Failed to exchange token with Shopify');
    }

    const data = await response.json();
    return success(data);
  } catch (error) {
    console.error('Token exchange error:', error);
    return serverError();
  }
};

module.exports = { handler };