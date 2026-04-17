import axios from 'axios';

const MEDUSA_API_URL = 'http://localhost:9000';
const ADMIN_EMAIL = 'admin@silvia.com';
const ADMIN_PASSWORD = 'Jordan234';

async function debugAuth() {
  const endpoints = [
    '/auth/user/emailpass',
    '/auth/admin/emailpass',
    '/admin/auth/emailpass',
    '/auth/user/emailpass/admin',
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Testing ${endpoint}...`);
      const res = await axios.post(`${MEDUSA_API_URL}${endpoint}`, {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
      console.log(`✅ SUCCESS at ${endpoint}`);
      console.log('Headers:', res.headers);
      return;
    } catch (err) {
      console.log(`❌ FAILED at ${endpoint}: ${err.response?.status || err.message}`);
      if (err.response?.data) console.log('Data:', JSON.stringify(err.response.data));
    }
  }
}

debugAuth();
