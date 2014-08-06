var util = require('util'),
    express = require('express');

var port = process.env.port || 1337;
var app = express();
var list = {};

app.use(function (req, res, callback) {
    if (req.readable) {
        var content = '';
        req.on('data', function (data) {
            content += data;
        }).on('end', function () {
            try {
                req.post_ext = JSON.parse(content);
            } catch (e) {}
            req.post_ext || (req.post_ext = content);
            callback();
        });
    }
    else {
        callback();
    }
});

app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(util.inspect(resolve(req)));
}).get('/reg', function (req, res) {
    res.end(util.inspect(reg(req)));
}).post('/reg', function (req, res) {
    res.end(util.inspect(reg(req)));
}).get('/list', function (req, res) {
    var name = req.query.name;
    if (name) {
        if (list[name]) {
            res.write(util.inspect(list[name], {depth: 5}));
        }
    } else {
        res.write(util.inspect(list, {depth: 5}));
    }
    res.end();
}).get('/clear', function (req, res) {
    list = {};
    res.end('true');
}).get('/debug', function (req, res) {
    res.write(util.inspect(req.headers));
    res.end();
}).listen(port);

function resolve(req) {
    var ip = {
        ip: req.ip,
        'socket-ip': req.socket.remoteAddress,
        'x-forwarded-for': req.headers['x-forwarded-for']
    };
    ip.ip || (ip.ip = ip['socket-ip']
        ? ip['socket-ip']
        : (ip['x-forwarded-for'] ? ip['x-forwarded-for'].split(',')[0].split(':')[0] : ''));
    return ip;
}

function reg(req) {
    var name = req.query.name, result;
    if (name) {
        result = list[name] = {
            ip: resolve(req),
            since: new Date()
        };
        req.post_ext && (result.ext = req.post_ext);
    }
    return result;
}


process.on('uncaughtException', function (err) {
    console.log('[Error catched by process]' + err);
});
