const asciiMap = require('../common/map')
const rusAlf = require('../common/rusAlf')

const getRusNum = (char) => {
    const bigNum = rusAlf[0].indexOf(char)

    if (bigNum !== -1) {
        return bigNum
    }

    return rusAlf[1].indexOf(char)
}

/**
 * ## Функция для вычисления хеша
 * 
 * @param {String} message - исходное сообщение
 * @param {Number} p 
 * @param {Number} q 
 * @returns {String}
 */
const hash = (message, p, q, h0) => {
    console.log('%c------------ RUN HASH ---------------------', 'color: #a22');

    console.log('Исходное сообщение: ', `"${message}"`);
    console.log('p: ', p);
    console.log('q: ', q);
    console.log('h0: ', h0);
    const n = p * q;
    console.log('Вычислили n = p * q', n)
    let h = h0; // константа варианта

    console.log('Начинаем генерацию Hash (h_i = ((code + h_(i-1)) ^ 2) mod n)...')

    // преобразовываем строку в массив символов и проходимся по каждому
    message.split('').map((char, i) => {
        // получаем ASCII Code символа
        //const code = asciiMap[char] ? +asciiMap[char].dec : char.charCodeAt();
        //Он хочет дичь в виде номера в алфавите
        const code = (num => num !== -1 ? num + 1 : char.charCodeAt())(getRusNum(char));

        console.log('Получаем код символа: ', code)

        const newH = ((+code + +h) ** 2) % n;

        console.log(`h${i + 1} = ((${code} + ${h}) ^2) mod ${n} = (${+code + +h} ^ 2) mod ${n} = ${(+code + +h) ** 2} mod ${n} = ${newH}`)

        // считаем очередной раундовый H (см. алгоритм)
        h = newH;
    })

    console.log('Результат вычисления HASH: ', h);

    console.log('%c------------ END HASH ---------------------', 'color: #a22');

    return h;
}

module.exports = hash;
