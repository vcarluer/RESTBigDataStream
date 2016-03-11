var chai = require('chai')
var expect = chai.expect
var dataGenerator = require('../datagenerator')

describe('Big data set creation test', () => {
	it('should return a simple object if asked', () => {
		var data = dataGenerator.getSimpleData()
		expect(data).to.exist
		expect(data.data).to.equal('test')
	})
})
