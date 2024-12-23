const { defaultHeaders } = require('./headers');

const createResponse = (statusCode, body) => ({
  statusCode,
  headers: defaultHeaders,
  body: JSON.stringify(body)
});

const success = (data) => createResponse(200, data);
const created = (data) => createResponse(201, data);
const badRequest = (message) => createResponse(400, { error: message });
const methodNotAllowed = () => createResponse(405, { error: 'Method not allowed' });
const serverError = (message = 'Internal server error') => createResponse(500, { error: message });

module.exports = {
  success,
  created,
  badRequest,
  methodNotAllowed,
  serverError
};