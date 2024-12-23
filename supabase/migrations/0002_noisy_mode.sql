/*
  # Create notes table

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `content` (text, required)
      - `created_at` (timestamp with timezone)
      
  2. Security
    - Enable RLS on `notes` table
    - Add policies for authenticated users to read and create notes
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users"
  ON notes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow insert for authenticated users"
  ON notes
  FOR INSERT
  TO authenticated
  WITH CHECK (true);