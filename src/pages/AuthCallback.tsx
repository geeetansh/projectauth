import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopifyAuth } from '../services/auth/oauth';
import { storeService } from '../services/stores';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(window.location.search);
      
      try {
        const isValid = await ShopifyAuth.validateCallback(searchParams);
        if (!isValid) {
          throw new Error('Invalid callback parameters');
        }

        const shop = searchParams.get('shop')!;
        const code = searchParams.get('code')!;
        
        const token = await ShopifyAuth.getAccessToken(shop, code);
        if (!token) {
          throw new Error('Failed to get access token');
        }

        // Save the store details to Supabase
        const store = await storeService.saveStore(
          shop,
          token.accessToken,
          token.scope
        );

        if (!store) {
          throw new Error('Failed to save store details');
        }

        navigate('/');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Authentication failed');
      }
    };

    handleCallback();
  }, [navigate]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Authentication Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Completing Authentication</h1>
        <p className="text-gray-600">Please wait while we complete the authentication process...</p>
      </div>
    </div>
  );
}