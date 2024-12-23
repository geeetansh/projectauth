import { Handler } from '@netlify/functions';
import { createClient } from '@supabase/supabase-js';
import { logger } from './utils/logger';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

export const handler: Handler = async (event) => {
  logger.info('Notes function called', { method: event.httpMethod });

  // GET request to retrieve notes
  if (event.httpMethod === 'GET') {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      logger.info('Notes retrieved successfully', { count: data.length });
      return {
        statusCode: 200,
        body: JSON.stringify(data)
      };
    } catch (error) {
      logger.error('Error retrieving notes', { error });
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to retrieve notes' })
      };
    }
  }

  // POST request to create a note
  if (event.httpMethod === 'POST') {
    try {
      const { content } = JSON.parse(event.body || '{}');

      if (!content) {
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Content is required' })
        };
      }

      const { data, error } = await supabase
        .from('notes')
        .insert([{ content }])
        .select()
        .single();

      if (error) throw error;

      logger.info('Note created successfully', { noteId: data.id });
      return {
        statusCode: 201,
        body: JSON.stringify(data)
      };
    } catch (error) {
      logger.error('Error creating note', { error });
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Failed to create note' })
      };
    }
  }

  return {
    statusCode: 405,
    body: JSON.stringify({ error: 'Method not allowed' })
  };
};