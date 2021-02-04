const express = require('express')
const app = express();
const bodyParser = require('body-parser')
const config = require('config')
let port = config.get('port');
const routes = require('./routes').router;

app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.listen(port)


app.use('/', routes)

