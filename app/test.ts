const nodeFetch = require('node-fetch');

async function test() {
  try {
    const response = await nodeFetch('http://localhost:3000/api/cron');
    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error:', error);
  }
}

test(); 