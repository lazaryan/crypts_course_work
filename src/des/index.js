const keygen = require('./keygen');
const f = require('./fFunction');
const { toBinString } = require('../common/utils')

const IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

const FINAL_IP = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

/**
 * Функция генератор случайного рандмного числа заданной длины
 * @param {Number} len : Длина выходного бинарного числа
 * @returns {String} сдучайно рандомное число
 */
const randomBinGenerate = (len = 1) => {
    let str = ''

    for (let i = 0; i < len; i++) {
        str += Math.round(Math.random()).toString()
    }

    return str;
}

// выкидываем каждый 8-ой символ -> 56
// снова вычеркиваем каждый 8-ой и ис последнего еще 7-ой -> 48
const generateVariableKey = (message = '') => {
    const removeISumvol = (message, i) => {
        let str = ''

        for (let j = 0; j < message.length; j++) {
            if (j % i !== 0) {
                str += message[j]
            }
        }

        return str;
    }

    const round1 = removeISumvol(message, 8);
    const round2 = removeISumvol(round1, 8);

    const result = round2.split('').splice(round2.length - 2, 1).join('');

    return result;
}

const des = (message = '', initialKey = '') => {
    //православная генерация ключей
    //const keys = keygen(randomBinGenerate(56));
    const keys = [generateVariableKey(initialKey)]

    const ipMessage = IP.map(key => message[key - 1])

    //старт 1-го круга
    let left = ipMessage.slice(0, 32).join('')
    let right = ipMessage.slice(32).join('')

    const rigthAfterF = f(right, keys[0])

    const xorRound = parseInt(left, 2) ^ parseInt(rigthAfterF, 2)
    const strXorRound = toBinString(xorRound, 32)

    const result = strXorRound + rigthAfterF;
    //конец 1-го раунда

    const resultMessage = FINAL_IP.map(key => result[key - 1]).join('')

    return resultMessage;
}

module.exports = des;
