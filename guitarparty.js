const http = require('http');

function Guitarparty(apiKey) {
  this.apiKey = apiKey;
};

Guitarparty.prototype.request = function(endpoint, callback) {
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
      callback(null, JSON.parse(body));
    })
  });

  req.on('error', e => {
    callback(e, null);
  });

  req.end();
};

module.exports = Guitarparty;
