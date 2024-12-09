require('dotenv').config(); 
const express = require('express')
var cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
const fs = require('fs');
const fileUpload = require('express-fileupload');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'], 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
    credentials: true
};

app.use(cors(corsOptions))

app.use(express.static('public'));

app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
}));

const db = require("./models");
db.sequelize.sync({
}).then(() => {
    console.log("db resync");
});

app.use(function (error, req, res, next) {
    if (error instanceof SyntaxError) {
        res.status(400).json({
            msg: 'Error en el JSON'
        });
    } else {
        next();
    }
});

require('./routes')(app);


const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log(`Ingrese a http://localhost:${PORT}`)
});

app.get('/env', (req, res) => {
    res.json({ port: process.env.PORT, secretKey: process.env.SECRET_KEY });
});
