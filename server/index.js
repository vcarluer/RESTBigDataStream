var http = require('http')

var server = http.createServer((request, response) => {
	response.writeHead(200)
	response.end()
})

server.listen(8072)
console.log('Server is listening on port 8072')
