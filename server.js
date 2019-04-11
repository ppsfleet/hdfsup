/*
Test en devel on windows : 
http://localhost:3000/File?path=Capture.png&biblio=phone => image miniature
http://localhost:3000/File?path=01.flac&biblio=phone => adele mp3

*/


const Express = require('express')
//const Fs = require('fs');
const Child_process = require('child_process');
const BodyParser = require('body-parser')

const app = Express();
app.use((request, response, next) => {
    response.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE,GET,PATCH,POST,PUT',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    });
    // intercept OPTIONS method
    if(request.method === 'OPTIONS') {
        response.send(200);
    } else {
        next();
    }
});

var Spawn = Child_process.spawn;
var jsonParser = BodyParser.json()
var urlencodedParser = BodyParser.urlencoded({ extended: false })   

const File = require('./file');
const Config = require('./config');
currentfiles = new File(Config)

app.get('/', 
    function (req, res,next) 
    {
        res.send("<h1>welcome !</h1>");
    })

app.get('/file',
    function(req, res,next)
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
    function(req, res,next)
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
