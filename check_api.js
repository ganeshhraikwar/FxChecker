const http = require('https');
http.get('https://api.frankfurter.dev/v1/2020-01-01..2020-01-04?base=EUR&symbols=USD', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log(data));
}).on('error', console.error);
