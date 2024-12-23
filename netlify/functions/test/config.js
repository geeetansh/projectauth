export const config = {
  baseUrl: process.env.NETLIFY_URL || 'http://localhost:8888/.netlify/functions',
  timeoutMs: 10000, // 10 second timeout
};