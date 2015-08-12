var http = require('http');
var express = require('express');

var redisController = require('./app/connections/redisConnectionController');

var app = express();

console.log('\nRedis Connection Established.');

app.get('/', function(req, res){
   conn = redisController.getConnection();
    console.log(conn);
    console.log('request received!');
    console.log(req.body);
    res.send(req.body);
    res.end();
});


var server = app.listen(3002, function(){
    console.log('\nNode Server listening at http://%s:%s', server.address().address, server.address().port);
});
