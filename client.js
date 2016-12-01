const http = require('http');
const os = require('os');

var name = os.hostname();
var interval = 1000 * 3600;
var error_limit = 24;

var options = {
  hostname: 'localhost',
  port: 1444,
  path: '/reg?name=' + name,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

var ext = JSON.stringify(os.networkInterfaces());
var error_count = 0;

function reg() {
  http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (data) {
      console.info(data);
    });
    error_count = 0;
  }).on('error', function (err) {
    error_count++;
    console.log(err);
  }).end(ext);
  if (interval && error_count < error_limit) {
    setTimeout(reg, interval);
  }
}

reg();
