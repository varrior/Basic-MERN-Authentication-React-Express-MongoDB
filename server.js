const express = require('express');
const app = express();
const router = express.Router();
const port = process.env.PORT || 80;
const http = require('http').Server(app);
const path = require('path');
const mongoose = require('mongoose');
const routes = require('./server/app/api')(router);
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true }))
app.use(morgan('dev'));

app.use('/api', routes);

app.get('*', (req, res) => res.sendFile(path.join(__dirname + '/client/public/index.html')));

mongoose.connect('mongodb://localhost:27017/your-app-name', err => err?console.log(err):console.log('Successfully connected to MongoDB'));

http.listen(port, ()=> console.log(`Server running on ${port}`))
