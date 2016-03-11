module.exports = {
	getSimpleData: function() {
		return { data: 'test' }
	},

	getJSON: function(size, count) {
		var json
		if (count) {
			var obj = {
				data: []
			}

			for (var i = 0; i < count; i++) {
				obj.data[i] = ''
				for (var j = 0; j < size; j++) {
					obj.data[i] += 'a'
				}
			}

			json = JSON.stringify(obj)
		} else {
			json = '{'
			for(var i = 0; i < size - 2; i++) {
				json += 'a'
			}

			json += '}'
		}
	

		return json
	}
}
