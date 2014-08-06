var http = require('http'),
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

var ext = JSON.stringify(os.networkInterfaces());

http.request(options, function (res) {
    res.setEncoding('utf8');
    res.on('data', function (data) {
        console.log(data);
    })
}).end(ext);

process.on('uncaughtException', function (err) {
    console.log('[Error catched by process]' + err);
});
