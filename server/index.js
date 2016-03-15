var http = require('http')
var datagenerator = require('./datagenerator')
var url = require('url')
var fs = require('fs')
var path = require('path')
var util = require('util')
var process = require('process')
var jsonstream = require('JSONStream')

var server = http.createServer((request, response) => {
    var method = request.method.toLocaleLowerCase()
    if (method === 'post') {
        console.log('Starting data reception from POST request')
         var body = ''
         var parsedObj = {
             data: []
         };
         
         //var receivedStream = fs.createWriteStream('.\\data\\received.json')         
         // request.pipe(receivedStream)
         var objStream = jsonstream.parse('data.*')
         request.pipe(objStream)
        request.on('data', function (chunk) {
            // process.stdout.write('#')
            if (chunk) {
                // body += chunk
                // console.log('chunk: ' + chunk)
                // var data = streamParser.parse(chunk)    
            }
        })
        request.on('end', function () {
            console.log('Received body with length: ' + body.length)
            var bodyObject
            if (body) {                
                // console.log(body)
                /*bodyObject = JSON.parse(body)
                console.log('Object count: ' + bodyObject.data.length)
                console.log('First object prop0: ' + bodyObject.data[0].prop0)
                console.log('Last object prop9: ' + bodyObject.data[bodyObject.data.length - 1].prop9)*/
            } else {
                bodyObject = {}
            }            
            
        })
        
        objStream.on('data', (data) => {
            // console.log('Object received: ' + JSON.stringify(data))
           //  process.stdout.write('#')
            parsedObj.data[parsedObj.data.length] = data
        })
        
        objStream.on('end', () => {
            console.log('JSONStream end with object count of ' + parsedObj.data.length)
            console.log('First object prop0: ' + parsedObj.data[0].prop0)
            console.log('Last object prop9: ' + parsedObj.data[parsedObj.data.length - 1].prop9)
            
            response.end()            
        })
                        
    } else {
        var reqUrl = url.parse(request.url)
        if (reqUrl.pathname.substr(0, 5) === '/data') {
            response.writeHead(200, {'Content-Type': 'application/octet-stream'})
            var respath = path.join('.', reqUrl.pathname)
            console.log(util.format('streaming %s', respath))
            var stream = fs.createReadStream(respath)
            stream.pipe(response)

            stream.on('end', () => {
                response.end()
                console.log('stream end')
            })
        } else {
            var size = 10
            if (reqUrl.pathname && reqUrl.pathname !== '/') {
                size = reqUrl.pathname.substr(1)
            }

            if (isNaN(size)) {
                response.writeHead('403', 'Size not a number')
                response.end()
            } else {            
                response.writeHead(200, {'Content-Type': 'application/json'})
                if (size <= 10) {
                    var json = datagenerator.getMillions(size)
                    response.write(json)
                    response.end()   
                } else {
                    var dataPath = '.\\data\\data' + size + '.json'
                    console.log('Generating data for big JSON stream')
                    datagenerator.writeMillions(dataPath, size).then(() => {
                        console.log('Streaming big JSON to HTTP response ')
                        var stream = fs.createReadStream(dataPath)
                        stream.pipe(response)
                        
                        stream.on('data', () => {
                            process.stdout.write('#')    
                        })
                        
                        stream.on('end', () => {
                            response.end()
                            console.log('Stream of big JSON end')
                        })
                    })
                }			
            }
        }
    }
})

server.on('connection', (socket) => {
    socket.setTimeout(1000 * 60 * 300)
})

server.listen(8072)
console.log('Server is listening on port 8072')
