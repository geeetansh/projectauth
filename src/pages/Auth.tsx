import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopifyAuth } from '../services/auth/oauth';
import { useAuth } from '../components/AuthProvider';

export default function Auth() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const shopDomain = 'classification-prompt-3.myshopify.com';
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
      return;
    }

    // Directly initiate OAuth flow with the specified shop
    const authUrl = ShopifyAuth.getAuthUrl(shopDomain);
    window.location.href = authUrl;
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">Authenticating...</h1>
        <p className="text-gray-600">Redirecting to Shopify authentication...</p>
      </div>
    </div>
  );
}