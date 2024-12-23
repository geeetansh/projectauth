export const config = {
  headers: {
    json: { 'Content-Type': 'application/json' },
    cors: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Methods': 'POST, OPTIONS'
    }
  }
};