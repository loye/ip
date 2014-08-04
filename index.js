var express = require('express');

var port = process.env.port || 1337;
var app = express();
var list = {};

app.get('/', function (req, res) {
    var ip = resolve(req);
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(ip);
}).get('/reg', function (req, res) {
    var name = req.query.name;
    var ip = resolve(req);
    if (name && ip) {
        list[name] = ip;
        res.write(ip);
    }
    res.end();
}).get('/list', function (req, res) {
    var name = req.query.name;
    if (name && list[name]) {
        res.write(list[name]);
    } else {
        Object.keys(list).forEach(function (k) {
            res.write(k + ': ' + list[k] + '\r\n');
        });
    }
    res.end();
}).listen(port);

function resolve(req) {
    var ip = req.headers['X-Forwarded-For'];
    ip || (ip = req.socket.remoteAddress);
    return ip;
}

process.on('uncaughtException', function (err) {
    console.log('[Error catched by process]' + err);
});
