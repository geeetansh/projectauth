import React, { useState } from 'react';
import { Store } from 'lucide-react';
import { validateShopDomain } from '../utils/shopify';
import { ShopifyAuth } from '../services/auth/oauth';

export default function ShopSelect() {
  const [shopDomain, setShopDomain] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateShopDomain(shopDomain)) {
      setError('Please enter a valid Shopify store domain');
      return;
    }

    const shop = shopDomain.includes('.myshopify.com') 
      ? shopDomain 
      : `${shopDomain}.myshopify.com`;

    // Use ShopifyAuth to get auth URL
    const authUrl = ShopifyAuth.getAuthUrl(shop);
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <Store className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Connect your Shopify store
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your store domain to get started
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="shop-domain" className="sr-only">
                Shop Domain
              </label>
              <input
                id="shop-domain"
                name="shop-domain"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="yourstore.myshopify.com"
                value={shopDomain}
                onChange={(e) => setShopDomain(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connect Store
          </button>
        </form>
      </div>
    </div>
  );
}