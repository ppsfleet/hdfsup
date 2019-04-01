/*
Test en devel on windows : 
http://localhost:3000/File?path=Capture.png&biblio=phone => image miniature
http://localhost:3000/File?path=01.flac&biblio=phone => adele mp3

*/


const Express = require('express')
//const Fs = require('fs');
const Child_process = require('child_process');
var Spawn = Child_process.spawn;
const app = Express();
const BodyParser = require('body-parser')

var jsonParser = BodyParser.json()
var urlencodedParser = BodyParser.urlencoded({ extended: false })   

const File = require('./file');
const Config = require('./config');
currentfiles = new File(Config)
console.log("plouf")

app.get('/', 
    function (req, res) 
    {
        res.send("<h1>welcome !</h1>");
    })

app.get('/file',
    function(req, res)
    {
        if(req.query.path != null)
        {
                if(Config.server != null && Config.user != null)
                {
                    let path = req.query.path;
                    let id = currentfiles.sendFile(path);
                    res.status(201).json(id);
                }         
                else
                {
                    console.log("Server or/and user are not defined")
                    res.sendStatus(500);
                }
        }
        else
        {
            res.sendStatus(400);
        }
    })

app.get('/status',
    function(req, res)
    {
        if(req.query.pid != null)
        {
            res.status(200).json(currentfiles.getStatus(req.query.pid))
        }
        else
        {
            res.sendStatus(400);
        }
    })

app.listen(Config.port, function () {
    console.log('The server is listening on port ' + Config.port + '')
})
