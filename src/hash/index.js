const asciiMap = require('../common/map')

/**
 * ## Функция для вычисления хеша
 * 
 * @param {String} message - исходное сообщение
 * @param {Number} p 
 * @param {Number} q 
 * @returns {String}
 */
const hash = (message, p, q) => {
    const n = p * q;
    let h = 5; // константа варианта

    // преобразовываем строку в массив символов и проходимся по каждому
    message.split('').map(char => {
        // получаем ASCII Code символа
        const code = asciiMap[char] ? +asciiMap[char].dec : char.charCodeAt();

        // считаем очередной раундовый H (см. алгоритм)
        h = ((code + h) ** 2) % n;
    })

    return h;
}

module.exports = hash;
