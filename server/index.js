var http = require('http')
var datagenerator = require('./datagenerator')
var url = require('url')
var fs = require('fs')
var path = require('path')
var util = require('util')
var process = require('process')

var server = http.createServer((request, response) => {
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
})

server.listen(8072)
console.log('Server is listening on port 8072')
