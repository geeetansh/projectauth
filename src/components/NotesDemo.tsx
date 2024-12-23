import React, { useState, useEffect } from 'react';
import { Send } from 'lucide-react';

interface Note {
  id: string;
  content: string;
  created_at: string;
}

export function NotesDemo() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/.netlify/functions/notes');
      const data = await response.json();
      setNotes(data);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/.netlify/functions/notes', {
        method: 'POST',
        body: JSON.stringify({ content: newNote }),
      });
      
      if (response.ok) {
        setNewNote('');
        fetchNotes();
      }
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Notes Demo</h2>
      
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
            <p className="text-gray-800">{note.content}</p>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(note.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}