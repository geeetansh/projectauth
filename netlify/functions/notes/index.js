import { supabase } from '../utils/supabase';

const getNotes = async () => {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

const createNote = async (content) => {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ content }])
    .select()
    .single();

  if (error) throw error;
  return data;
};

export default async function handler(req, context) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
      }
    });
  }

  if (req.method === 'GET') {
    try {
      const data = await getNotes();
      console.info('Notes retrieved successfully', { count: data.length });
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error retrieving notes:', error);
      return new Response(JSON.stringify({ error: 'Failed to retrieve notes' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  if (req.method === 'POST') {
    try {
      const { content } = await req.json();

      if (!content) {
        return new Response(JSON.stringify({ error: 'Content is required' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = await createNote(content);
      console.info('Note created successfully', { noteId: data.id });
      return new Response(JSON.stringify(data), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error creating note:', error);
      return new Response(JSON.stringify({ error: 'Failed to create note' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return new Response(JSON.stringify({ error: 'Method not allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  });
}