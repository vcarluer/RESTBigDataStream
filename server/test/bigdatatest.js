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

	it ('should return a json array of 1000 items of length 10', () => {
		var json = dataGenerator.getJSON(10, 1000)
		var obj = JSON.parse(json)
		expect(obj.data.length).to.equal(1000)
		expect(obj.data[0].length).to.equal(10)
		console.log(json.length)
	})

	it('should return a json array of 1000 items with 10 property which have all a length of 10', () => {
		var json = dataGenerator.getJSON(10, 1000, 10)
		var obj = JSON.parse(json)
		expect(obj.data.length).to.equal(1000)
		expect(obj.data[0].prop0).to.exist
		expect(obj.data[0].prop1).to.exist
		expect(obj.data[0].prop2).to.exist
		expect(obj.data[0].prop3).to.exist
		expect(obj.data[0].prop4).to.exist
		expect(obj.data[0].prop5).to.exist
		expect(obj.data[0].prop6).to.exist
		expect(obj.data[0].prop7).to.exist
		expect(obj.data[0].prop8).to.exist
		expect(obj.data[0].prop9).to.exist
		expect(obj.data[0].prop0.length).to.equal(10)
		expect(obj.data[999].prop9.length).to.equal(10)
		console.log(json.length)
	})

	it('should return a json of more 10 millions characters', () => {
		var json = dataGenerator.getJSON(100, 10000, 10)
		expect(json).to.have.length.above(10*Math.pow(10, 6))
		console.log(json.length)
	})
})
