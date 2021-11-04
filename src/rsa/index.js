const keygen = require('./keygen')
const { smartMod } = require('../common/utils')

module.exports.keygen = keygen;

/**
 * ## Шифрование с помощью алгоритма RSA
 * 
 * Шифрование представляет из себя вырожение message ^ publicKey.e mod publicKey.n
 * Поэтому используется функция умного возвведения в степень `smartMod`
 * 
 * @param {String} message - исходное бинарное сообщение, которое потом преобразуется в число
 * @param {Object} keys - ключи алгоритма RSA, сгенерированные раннее
 * @returns {Number} - зашифрованное сообщение
 */
module.exports.encryptRSAMessage = (message, keys) => smartMod(
    parseInt(message, 2),
    keys.publicKey.e,
    keys.publicKey.n
);
