const crypto = require('crypto');

/**
 * Return a string of random alphabetic characters (A-Z, a-z) of length n.
 * @param {number} n - Non-negative integer length of the returned string.
 * @returns {string}
 */
function generateText(n) {
  if (!Number.isFinite(n) || n < 0) throw new TypeError('n must be a non-negative finite number');
  const len = Math.floor(n);
  if (len === 0) return '';

  const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ';
  const bytes = crypto.randomBytes(len);
  let out = '';
  for (let i = 0; i < len; i += 1) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

module.exports = generateText;
