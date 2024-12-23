/*
  # Create stores table for Shopify authentication

  1. New Tables
    - `stores`
      - `id` (uuid, primary key)
      - `shop_domain` (text, unique) - The store's myshopify.com domain
      - `access_token` (text) - Shopify access token
      - `scope` (text) - Granted scopes
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
  
  2. Security
    - Enable RLS on `stores` table
    - Add policies for secure access
*/

CREATE TABLE stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_domain text UNIQUE NOT NULL,
  access_token text NOT NULL,
  scope text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Allow read access to authenticated users
CREATE POLICY "Allow read access to authenticated users"
  ON stores
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow insert/update for authenticated users
CREATE POLICY "Allow insert for authenticated users"
  ON stores
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);