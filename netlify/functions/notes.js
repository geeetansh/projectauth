const { createClient } = require('@supabase/supabase-js');
const { success, created, badRequest, methodNotAllowed, serverError } = require('./utils/response');

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.VITE_SUPABASE_ANON_KEY
);

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

const handler = async (event) => {
  // Handle OPTIONS request for CORS
  if (event.httpMethod === 'OPTIONS') {
    return success({});
  }

  // GET request to retrieve notes
  if (event.httpMethod === 'GET') {
    try {
      const data = await getNotes();
      console.info('Notes retrieved successfully', { count: data.length });
      return success(data);
    } catch (error) {
      console.error('Error retrieving notes:', error);
      return serverError('Failed to retrieve notes');
    }
  }

  // POST request to create a note
  if (event.httpMethod === 'POST') {
    try {
      const { content } = JSON.parse(event.body || '{}');

      if (!content) {
        return badRequest('Content is required');
      }

      const data = await createNote(content);
      console.info('Note created successfully', { noteId: data.id });
      return created(data);
    } catch (error) {
      console.error('Error creating note:', error);
      return serverError('Failed to create note');
    }
  }

  return methodNotAllowed();
};

module.exports = { handler };