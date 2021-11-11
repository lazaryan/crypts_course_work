const { smartMod } = require('../common/utils')

/**
 * ## Функция вычисления Цифровой подписи для алгоритма RSA
 * 
 * Для цифровой подписи используется приватный ключ пользователя, т.е.
 * Он своим приватным ключем подписывает данные, а потом любой пользователь с помошью открытого ключа (который известен всем)
 * может лего проверить то, что данные были подписыны нужным ключем, который известен только 1-му человек
 * 
 * Цифровая подпись представляет из себя (message ^ privateKey.d) mod privateKey.n
 * Для правильности вычисления используем функцию умного возведения в степень `smartMod`
 * 
 * @param {Number} message - исходное сообщение
 * @param {Object} keys - ключи пользователя
 * @returns {Number} - Цифровая подпись нашего числа
 */
const ecp = (message, keys) => {
    console.log('%c------------ RUN ECP ---------------------', 'color: #a22');
    console.log('Исходный текст: ', message);
    console.log('Приватный ключ: ', keys.privateKey);
    const result = smartMod(message, keys.privateKey.d, keys.privateKey.n);

    console.log('%c------------ END ECP ---------------------', 'color: #a22');

    return result;
}

module.exports = ecp;
