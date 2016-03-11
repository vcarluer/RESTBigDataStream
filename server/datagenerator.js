module.exports = {
	getSimpleData: function() {
		return { data: 'test' }
	},

	getJSON: function(size, itemCount, propertyCount) {
		var json
		if (itemCount) {
			var obj = {
				data: []
			}

			for (var i = 0; i < itemCount; i++) {
				if (propertyCount) {
					obj.data[i] = {}
					for (var j = 0; j < propertyCount; j++) {
						obj.data[i]['prop' + j] = getData(size)
					}
				} else {
					obj.data[i] = getData(size)
				}
			}

			json = JSON.stringify(obj)
		} else {
			json = '{'
			json += getData(size - 2)
			json += '}'
		}
	

		return json
	},

	getMillions: function(millions) {
		return this.getJSON(100, 1000 * millions, 10)
	}
}

function getData(size) {
	var data = ''
	for (var j = 0; j < size; j++) {
		data += 'a'
	}

	return data
}
