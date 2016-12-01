const express = require('express');
const bodyParser = require('body-parser');
const ipaddr = require('ipaddr.js');

var port = process.env.port || 1444;
var app = express();
var list = {};

app.set('json spaces', 2);
app.set('trust proxy', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//ip, fix IPv4MappedAddress
app.use(function (req, res, next) {
  var ip = req.ip;
  var ipv4 = null;
  if (ip) {
    if (ipaddr.IPv4.isValid(ip)) {
      ipv4 = ip;
    } else if (ipaddr.IPv6.isValid(ip)) {
      var ipv6 = ipaddr.IPv6.parse(ip);
      if (ipv6.isIPv4MappedAddress()) {
        ipv4 = ipv6.toIPv4Address().toString();
      }
    }
    req.ipv4 = ipv4;
  }

  next();
});

app
  .get('/', function (req, res) {
    res.send({ip: req.ipv4});
  })
  .all('/reg', function (req, res) {
    res.send(reg(req));
  })
  .get('/list', function (req, res) {
    var name = req.query.name;
    if (name) {
      if (list[name]) {
        res.send(list[name]);
      }
    } else {
      res.send(list);
    }
    res.end();
  })
  .get('/clear', function (req, res) {
    list = {};
    res.send({success: true});
  })
  .get('/headers', function (req, res) {
    res.send(req.headers);
  })
  .listen(port, function () {
    console.info('server started on port', port);
  });

function reg(req) {
  var name = req.query.name, result;
  if (name) {
    result = list[name] = {
      ip: req.ipv4,
      since: new Date()
    };
    req.body && (result.ext = req.body);
  }
  return result;
}
