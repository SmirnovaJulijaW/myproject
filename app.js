var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var xml2js = require('xml2js');
var js2xmlparser = require("js2xmlparser");

var app = express();

app.set('view engine', 'jade');
app.use(express.static('node_modules'));
app.use(express.static('public'));
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'templates'));

app.get('/', function (req, res) {
    var parser = new xml2js.Parser();
    var fullpath = path.join(__dirname, 'tmp', '1.xml'); 
    fs.readFile(fullpath, function(err, data) {
        if (err) return;
        parser.parseString(data, function (err, result) {
            if (err) return;
            var parameters = result.Parameters.Parameter;
            res.render('edit', {parameters: parameters});
            res.end();
        });
    });
});

app.post('/upload/', function (req, res) {
    var xml = js2xmlparser("Parameters", req.body)
    res.set('Content-Type', 'text/xml');
    res.set('Content-Disposition', 'attachment; filename="Output.xml"')
    res.end(xml);
});

app.listen(8000, function () {
    console.log('Starting development server');
    console.log('Quit the server with CTRL-BREAK');
});