var chai = require('chai')
var expect = chai.expect
var dataGenerator = require('../datagenerator')

describe('Big data set creation test', () => {
	it('should return a simple object if asked', () => {
		var data = dataGenerator.getSimpleData()
		expect(data).to.exist
		expect(data.data).to.equal('test')
	})

	it('should return a json string of length 10', () => {
		var json = dataGenerator.getJSON(10)
		expect(json.length).to.equal(10)
	})

	it ('should return a json string of length 1000', () => {
		var json = dataGenerator.getJSON(1000)
		expect(json.length).to.equal(1000)
	})

	it ('should return a json an array of 1000 items of length 10', () => {
		var json = dataGenerator.getJSON(10, 1000)
		var obj = JSON.parse(json)
		expect(obj.data.length).to.equal(1000)
		expect(obj.data[0].length).to.equal(10)
	})
})
