const axios = require('axios');

async function testDriver() {
  try {
    const loginRes = await axios.post('http://localhost:8080/api/auth/login', {
      adminId: 'Admin123',
      username: 'testuser',
      password: 'Admin123'
    });
    const token = loginRes.data.token;
    
    const driverRes = await axios.post('http://localhost:8080/api/drivers', {
      firstName: 'simson',
      lastName: 'd',
      email: 'minmintux@gmail.com',
      phone: '7812890689',
      licenseNumber: 'TN25089502C',
      licenseCategory: 'COMMERCIAL_CDL',
      licenseExpiryDate: '2007-05-15',
      status: 'ON_TRIP',
      safetyScore: 95
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Driver saved successfully:', driverRes.data);
  } catch (err) {
    if (err.response) {
      console.log('Error status:', err.response.status, err.response.data);
    } else {
      console.log('Error:', err.message);
    }
  }
}
testDriver();
