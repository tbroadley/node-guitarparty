const http = require('http');

function Guitarparty(apiKey, options = {}) {
  this.apiKey = apiKey;
  this.cache = {};
  this.cacheExpiry = options.cacheExpiry || 3000;
};

Guitarparty.prototype.request = function(endpoint, callback) {
  let cacheEntry = this.cache[endpoint];

  if (cacheEntry && (Date.now() - cacheEntry.timestamp) / 1000 < this.cacheExpiry) {
    callback(null, this.cache[endpoint].data);
  }

  const options = {
    hostname: 'api.guitarparty.com',
    path: `/v2/${endpoint}`,
    headers: {
      'Guitarparty-Api-Key': this.apiKey
    },
  };

  let req = http.request(options, res => {
    let body = '';

    res.setEncoding('utf8');
    res.on('data', chunk => {
      body += chunk;
    });
    res.on('end', () => {
      const data = JSON.parse(body);

      cacheEntry = {
        timestamp: Date.now(),
        data,
      };

      callback(null, data);
    })
  });

  req.on('error', e => {
    callback(e, null);
  });

  req.end();
};

module.exports = Guitarparty;
