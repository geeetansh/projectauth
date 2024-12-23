import React from 'react';
import { Package } from 'lucide-react';

export default function Products() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <Package className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Products</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Product list will be implemented here */}
      </div>
    </div>
  );
}