// Quick test script to verify API functions work
const handler = require('./api/catalog/content.js');

// Mock request and response objects
const mockReq = {
  method: 'GET',
  query: {
    limit: 5,
    offset: 0
  }
};

const mockRes = {
  statusCode: 200,
  headers: {},
  body: null,
  
  setHeader(key, value) {
    this.headers[key] = value;
  },
  
  status(code) {
    this.statusCode = code;
    return this;
  },
  
  json(data) {
    this.body = data;
    console.log('\n✅ API Response:');
    console.log('Status:', this.statusCode);
    console.log('Data:', JSON.stringify(data, null, 2));
    return this;
  },
  
  end() {
    console.log('Response ended');
    return this;
  }
};

// Set environment variables from your credentials
// Use individual parameters
process.env.POSTGRES_HOST = 'ep-cool-leaf-aim15nlg-pooler.c-4.us-east-1.aws.neon.tech';
process.env.POSTGRES_PORT = '5432';
process.env.POSTGRES_DB = 'neondb';
process.env.POSTGRES_USER = 'neondb_owner';
process.env.POSTGRES_PASSWORD = 'npg_WJQ3sodu9Uyr';
process.env.POSTGRES_SSL = 'true'; // Enable SSL for Neon
process.env.NODE_ENV = 'development';

console.log('🧪 Testing API function...');
console.log('📡 Connecting to:', process.env.POSTGRES_HOST);

handler(mockReq, mockRes)
  .then(() => {
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  });
