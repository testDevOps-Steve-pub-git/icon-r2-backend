const expect = require('chai').expect
const pdfService = require(`${__base}/server/services/pdf-service`)

describe('PDF service', () => {
  it('should create a PDF document with a given document definition', () => {
    const docDefinition = {
      content: [
        'This is a paragraph'
      ]
    }

    const result = pdfService.generatePdf(docDefinition)
    expect(result).to.have.property('options')
    expect(result).to.have.property('readable', true)
  })

  it('should throw an error when given an invalid document definition', () => {
    const docDefinition = {}

    try {
      pdfService.generatePdf(docDefinition)
      expect.fail()
    } catch (err) {
      expect(err).to.be.exist
    }
  })
})
