var util = require('util'),
    express = require('express');

var port = process.env.port || 1337;
var app = express();
var list = {};

app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(req.ip);
}).get('/reg', function (req, res) {
    res.end(util.inspect(reg(req)));
}).post('/reg', function (req, res) {
    res.end(util.inspect(reg(req)));
}).get('/list', function (req, res) {
    var name = req.query.name;
    if (name) {
        if (list[name]) {
            res.json(util.inspect(list[name]));
        }
    } else {
        res.write(util.inspect(list));
    }
    res.end();
}).get('/clear', function (req, res) {
    list = {};
    res.end('true');
}).listen(port);

function reg(req) {
    var name = req.query.name, result;
    if (name) {
        var ext = req.query.ext;
        result = list[name] = {
            ip: req.ip,
            since: new Date()
        };
        ext && (result.ext = ext);
    }
    return result;
}


process.on('uncaughtException', function (err) {
    console.log('[Error catched by process]' + err);
});
