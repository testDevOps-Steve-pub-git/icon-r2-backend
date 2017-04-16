var expect = require('chai').expect
var pdfService = require(`${__base}/server/services/pdf-service`)

describe('PDF service', () => {
  it('should create a PDF document with a given document definition', () => {
    var docDefinition = {
      content: [
        'This is a paragraph'
      ]
    }

    var result = pdfService.generatePdf(docDefinition)
    expect(result).to.have.property('options')
    expect(result).to.have.property('readable', true)
  })

  it('should throw an error when given an invalid document definition', () => {
    var docDefinition = {}

    try {
      pdfService.generatePdf(docDefinition)
      expect.fail()
    } catch (err) {
      expect(err).to.be.exist
    }
  })
})
