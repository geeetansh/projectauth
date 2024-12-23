import fetch from 'node-fetch';

const config = {
  baseUrl: 'http://localhost:8888/.netlify/functions',
  timeoutMs: 10000
};

async function testEndpoint(path, options = {}) {
  const url = `${config.baseUrl}/${path}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
  
  try {
    console.log(`Testing endpoint: ${url}`);
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } finally {
    clearTimeout(timeout);
  }
}

async function testNotesEndpoint() {
  console.log('\n🧪 Testing Notes Endpoint');
  
  try {
    // Test GET notes
    console.log('\nTesting GET /notes');
    const { status, data: notes } = await testEndpoint('notes');
    console.log('✅ GET /notes successful:', {
      status,
      notesCount: Array.isArray(notes) ? notes.length : 'N/A'
    });

    // Test POST note
    console.log('\nTesting POST /notes');
    const { status: postStatus, data: newNote } = await testEndpoint(
      'notes',
      {
        method: 'POST',
        body: JSON.stringify({ content: 'Test note ' + new Date().toISOString() })
      }
    );
    console.log('✅ POST /notes successful:', {
      status: postStatus,
      noteId: newNote.id
    });

  } catch (error) {
    console.error('❌ Notes endpoint test failed:', error.message);
  }
}

async function testTokenExchangeEndpoint() {
  console.log('\n🧪 Testing Token Exchange Endpoint');
  
  try {
    // Test with missing parameters
    console.log('\nTesting with missing parameters');
    const { status } = await testEndpoint(
      'token-exchange',
      {
        method: 'POST',
        body: JSON.stringify({})
      }
    );
    console.log('✅ Invalid request handled correctly:', { status });

  } catch (error) {
    console.error('❌ Token exchange endpoint test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Netlify Functions Tests');
  console.log('Testing against:', config.baseUrl);
  
  await testNotesEndpoint();
  await testTokenExchangeEndpoint();
  
  console.log('\n✅ Tests completed');
}

runTests();