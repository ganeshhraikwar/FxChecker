import https from 'https';

https.get('https://api.frankfurter.dev/v1/2024-01-01..2024-01-31?base=USD&symbols=EUR', (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log('dev hist range:', data.slice(0, 100)));
});
