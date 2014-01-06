var Betacode = function(betacode, options) {
  if (!betacode) {
    throw new Error('First argument needs to be a betacode string.');
  }

  betacode = betacode.replace(/\n/g, '\\n');
  betacode = betacode.replace('\s', '\\s', 'g');

  this.betacode = betacode;
  this.unicode = '';
  this.accentQueue = '';
  this.capitalizeNext = false;
  this.previousWasLetter = false;
  this.useFinalSigma = (options || {}).sigma || false;
};

Betacode.prototype = {
  transcribe: function() {
    var i = 0;
    var betacode = this.betacode;

    var appendAsUnicode = function(character) {
      if (isLetter(character)) {
        if (this.capitalizeNext) {
          character = character.toUpperCase();
          this.capitalizeNext = false;
        }

        this.unicode += (character + this.accentQueue);
        this.accentQueue = '';
      } else if (isNonSpacingMark(character)) {
        if (this.previousWasLetter) {
          this.unicode += character;
        } else {
          this.accentQueue += character;
        }
      } else {
        this.previousWasLetter = false;
        this.unicode += character;
      }
    }.bind(this);

    var isLetter = function(character) {
      var charCode = character.charCodeAt(0);

      return charCode >= 65 && charCode <= 122;
    }.bind(this);

    var isNonSpacingMark = function(character) {
      return this.accentCharacters.indexOf(character) >= 0;
    }.bind(this);

    while (i < betacode.length) {
      var c = betacode[i].toUpperCase();

      if (c === '*') {
        this.capitalizeNext = true;
      }

      if (c === 'S' && this.useFinalSigma) {
        if (i === betacode.length - 1
            || /\s/.test(betacode[i + 1])) {
          appendAsUnicode(this.sigmas[2]);
        } else {
          appendAsUnicode(this.sigmas[1]);
        }
      } else {
        appendAsUnicode((this.dictionary[c] || c));
      }

      i++;
    }

    return this.unicode;
  },

  dictionary: {
    'A':  '\u03b1', // alpha
    'B':  '\u03b2', // beta
    'C':  '\u03be', // xi
    'D':  '\u03b4', // delta
    'E':  '\u03b5', // epsilon
    'F':  '\u03c6', // phi
    'G':  '\u03b3', // gamma
    'H':  '\u03b7', // eta
    'I':  '\u03b9', // iota
    'K':  '\u03ba', // kappa
    'L':  '\u03bb', // lambda
    'M':  '\u03bc', // mu
    'N':  '\u03bd', // nu
    'O':  '\u03bf', // omicron
    'P':  '\u03c0', // pi
    'Q':  '\u03b8', // theta
    'R':  '\u03c1', // rho
    'S':  '\u03f2', // lunate sigma
    'T':  '\u03c4', // tau
    'U':  '\u03c5', // upsilon
    'V':  '\u03dd', // digamma
    'W':  '\u03c9', // omega
    'X':  '\u03c7', // chi
    'Y':  '\u03c8', // psi
    'Z':  '\u03b6', // zeta
    ')':  '\u0313', // smooth breathing
    '(':  '\u0314', // rough breathing
    '/':  '\u0301', // acute
    '=':  '\u0342', // circumflex
    '\\': '\u0300', // grave
    '+':  '\u0308', // diaeresis
    '|':  '\u0345', // iota subscript
    '?':  '\u0323', // dot below
    ':':  '\u00b7', // middle dot
    '-':  '\u2010', // hyphen
    '_':  '\u2014' // em dash
  },

  accentCharacters: [
    ')',
    '(',
    '/',
    '=',
    '\\',
    '+',
    '|',
    '?'
  ],

  sigmas: {
    '1': '\u03c3', // medial sigma
    '2': '\u03c2' // final sigma
  }
};

module.exports = Betacode;

