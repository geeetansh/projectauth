import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { NotesDemo } from '../components/NotesDemo';

export default function Dashboard() {
  return (
    <div className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <LayoutGrid className="w-6 h-6" />
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>
      <NotesDemo />
    </div>
  );
}