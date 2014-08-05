var http = require('http'),
    util = require('util'),
    os = require('os');

var name = os.hostname();

var options = {
    hostname: 'localhost',
    port: 1337,
    path: '/reg?name=' + name,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }
};

var ext = util.inspect(os.networkInterfaces());

http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (data) {
        console.log(data);
    })
}).end(util.inspect({"ext": ext}));

process.on('uncaughtException', function (err) {
    console.log('[Error catched by process]' + err);
});
