const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

const defaultHeaders = {
  'Content-Type': 'application/json',
  ...corsHeaders
};

module.exports = { corsHeaders, defaultHeaders };