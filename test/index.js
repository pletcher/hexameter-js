var chai = require('chai');
var expect = chai.expect;
var Betacode = require('../index.js');
var testString = require('./test_string.js');
var lunateSigmaResult = require('./result_string.js').lunateSigma;
var finalSigmaResult = require('./result_string.js').finalSigma;

describe('Betacode', function() {
  it('throws an error if not instantiated with a string', function(done) {
    expect(Betacode).to.throw('First argument needs to be a betacode string.');
    done();
  });

  it('accepts an options object', function(done) {
    var b = new Betacode(testString, { sigma: true });

    expect(b.useFinalSigma).to.be.true;
    done();
  });

  it('transcribes from betacode to unicode', function(done) {
    var b = new Betacode(testString);

    expect(b.transcribe()).to.equal(lunateSigmaResult);
    done();
  });

  it('determines proper sigmas when asked', function(done) {
    var b = new Betacode(testString, { sigma: true });

    expect(b.transcribe()).to.equal(finalSigmaResult);
    done();
  });
});

