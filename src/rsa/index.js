const keygen = require('./keygen')
const { smartMod } = require('../common/utils')

module.exports.keygen = keygen;
module.exports.encryptRSAMessage = (message, keys) => smartMod(
    parseInt(message, 2),
    keys.publicKey.e,
    keys.publicKey.n
);
