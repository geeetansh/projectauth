import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './components/AuthProvider';
import { AppRoutes } from './routes';
import '@shopify/polaris/build/esm/styles.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AppRoutes />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;