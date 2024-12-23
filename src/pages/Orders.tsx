import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function Orders() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <ShoppingCart className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Orders</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Order list will be implemented here */}
      </div>
    </div>
  );
}