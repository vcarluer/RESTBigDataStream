var http = require('http')
var datagenerator = require('./datagenerator')
var url = require('url')
var fs = require('fs')
var path = require('path')
var util = require('util')

var server = http.createServer((request, response) => {
	var reqUrl = url.parse(request.url)
	if (reqUrl.pathname.substr(0, 5) === '/data') {
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
			var json = datagenerator.getMillions(size)
			response.write(json)
			response.end()
		}
	}
})

server.listen(8072)
console.log('Server is listening on port 8072')
