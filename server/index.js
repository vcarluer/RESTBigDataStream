var http = require('http')
var datagenerator = require('./datagenerator')
var url = require('url')

var server = http.createServer((request, response) => {
	var reqUrl = url.parse(request.url)
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
})

server.listen(8072)
console.log('Server is listening on port 8072')
