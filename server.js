var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');

http.createServer(function(req, res) {
    if (req.url === '/') {
        fs.readFile('./index.html', function(err, data) {
            if (err){
                throw err;
            }
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.write(data); 
            res.end();
            return;
        });
    } else if (req.url === '/styles.css') {
        fs.readFile('./styles.css', function (err, data) {
            console.log('test')
            console.log(data)
            if (err) { 
                console.log(err) 
                throw err; 
            }
            res.writeHead(200, { 'Content-Type': 'text/css' });
            res.write(data);
            res.end();
            return;
        });
    } else if (req.url === '/script.js') {
        fs.readFile('./script.js', function (err, data) {
            if (err) { throw err; }
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
            return;
        });
    } else if (req.url === '/getMethods.js') {
        fs.readFile('./getMethods.js', function (err, data) {
            if (err) { throw err; }
            res.writeHead(200, { 'Content-Type': 'text/javascript' });
            res.write(data);
            res.end();
            return;
        });
    }
}).listen(3000);