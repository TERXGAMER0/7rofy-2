// netlify/functions/verify.js
require('dotenv').config();

exports.handler = async function(event, context) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch (err) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON' })
    };
  }

  const code = (body.code || '').trim();
  const allowedCodes = process.env.ALLOWED_CODES
    .split(',')
    .map(c => c.trim());

  const valid = allowedCodes.includes(code);

  return {
    statusCode: valid ? 200 : 401,
    body: JSON.stringify({ valid })
  };
};
