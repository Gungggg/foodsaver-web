const http = require('http');
http.get('http://localhost:5000/uploads/1781877012582.jpg', (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (e) => {
  console.error('Fetch Error:', e);
});
