var fs = require('fs')
var path = require('path')

module.exports = {
	getSimpleData: function() {
		return { data: 'test' }
	},

    getJSON: function(size, itemCount, propertyCount) {
        return this.createJSON(null, size, itemCount, propertyCount)
    },

	createJSON: function(stream, size, itemCount, propertyCount) {
		var json
		if (itemCount) {
            if (stream) {
                stream.write('{"data":[')
            } else {
                var obj = {
				    data: []
			    }    
            }
			
			for (var i = 0; i < itemCount; i++) {
				if (propertyCount) {
					if (stream) {
                        if (i > 0) stream.write(',')
                        stream.write('{')
                    } else {
                        obj.data[i] = {}   
                    }
                    
					for (var j = 0; j < propertyCount; j++) {
                        var data = getData(size)
                        if (stream) {
                            if (j > 0) stream.write(',')
                            stream.write('"prop' + j + '":' + JSON.stringify(data))
                        } else {
                            obj.data[i]['prop' + j] = data    
                        }						
					}
                    if (stream) {
                        stream.write('}')
                    }
				} else {
					var data = getData(size)
                    if (stream) {
                        if (i > 0) stream.write(',')
                        stream.write(JSON.stringify(data))   
                    } else {
                        obj.data[i] = data    
                    }
				}
			}
               
            if (stream) {
                stream.write(']}')
            } else {
                json = JSON.stringify(obj)    
            }
			
		} else {
			json = '{'
			json += getData(size - 2)
			json += '}'
            if (stream) stream.write(json)
		}

		return json
	},

	getMillions: function(millions) {
		return this.getJSON(100, 1000 * millions, 10)
	},
    
	writeMillions: function(filePath, millions) {
		return this.writeJSON(filePath, 100, 1000 * millions, 10)
	},
    
    writeJSON: function(filePath, size, itemCount, propertyCount) {
        return new Promise((resolve, reject) => {
            var dirPath = path.dirname(filePath)
            createDirIfNeeded(dirPath).then(() => {
                var stream = fs.createWriteStream(filePath, { defaultEncoding: 'utf8', autoClose: true});
                this.createJSON(stream, size, itemCount, propertyCount)
                stream.end(() => {
                    resolve()    
                })
            })
            .catch((reason) => {
                console.log(reason)
                reject(reason)
            })    
        })        
    }
}

function createDirIfNeeded(dirPath) {
    return new Promise((resolve, reject) => {
        fs.access(dirPath, fs.F_OK, (err) => {
            if (err) {
                fs.mkdir(dirPath, (err) => {
                    if (err) reject(err)
                    resolve()
                })
            } else {
                resolve()
            }
        })
    })
}

function getData(size) {
	var data = ''
	for (var j = 0; j < size; j++) {
		data += 'a'
	}

	return data
}
