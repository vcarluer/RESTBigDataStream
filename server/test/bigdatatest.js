var chai = require('chai')
var expect = chai.expect
var dataGenerator = require('../datagenerator')
var fs = require('fs')
var path = require('path')

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

	it('should return a json of more 10 millions characters just with key word getMillions', () => {
		var json = dataGenerator.getMillions(10)
		expect(json).to.have.length.above(10*Math.pow(10, 6))
		console.log(json.length)
	})
    
    it('should stream to a file in data', (done) => {
        var filePath = '.\\test\\data\\data.json'
        dataGenerator.writeJSON(filePath, 10).then(() => {
            fs.access(filePath, fs.F_OK, (err) => {
                expect(err).to.be.null
                done()
            })    
        })
    })
    
    
	it('should write a json array of 1000 items of length 10', (done) => {
        var filePath = '.\\test\\data\\data.json'
		dataGenerator.writeJSON(filePath, 10, 1000).then(() => {
            fs.access(filePath, fs.F_OK, (err) => {
                expect(err).to.be.null
                fs.readFile(filePath, { encoding: 'utf8' }, (err, readdata) => {
                    var obj = JSON.parse(readdata)
                    expect(obj.data.length).to.equal(1000)
                    expect(obj.data[0].length).to.equal(10)
                    done()    
                })
            })    
        })
	})
    
    it('should write a json of more 10 millions characters', (done) => {
        var filePath = '.\\test\\data\\data10m.json'
		dataGenerator.writeJSON(filePath, 100, 10000, 10).then(() => {
            fs.stat(filePath, (err, stat) => {
                expect(stat.size).to.be.above(10*Math.pow(10, 6))
		        console.log('size: ' + stat.size)
                done()
            })
        })
        .catch((reason) => {
            console.log(reason)
            done()
        })
	})
    
    it('should write a json of more 10 millions characters with key word millions', (done) => {
        var filePath = '.\\test\\data\\datam.json'
		dataGenerator.writeMillions(filePath, 10).then(() => {
            fs.stat(filePath, (err, stat) => {
                expect(err).to.be.null
                expect(stat.size).to.be.above(10*Math.pow(10, 6))
		        console.log('size: ' + stat.size)
                done()
            })
        })
        .catch((reason) => {
            console.log(reason)
            expect(reason).to.be.null
            done()
        })
	})
})
