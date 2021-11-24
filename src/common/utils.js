/**
 * ## Функция для разбиения строки на равные блоки по size символов
 * 
 * @example
 * chunk('aaabbbccc', 3) => ['aaa', 'bbb', 'ccc']
 * @param {String} str - исходная строка
 * @param {Number} size - сколько в каждой подстроке должно быть символов
 * @returns {Array<String>} - массив строк длиной size
 */
const chunk = (str, size) => {
    return str.match(new RegExp('.{1,' + size + '}', 'g'));
}

/**
 * ## Функция для преобрзования числа в бинарный код заданной длины
 * >>> 0 используется для того, чтоб число не ушло в отрицательное значение
 * @param {Number} number - исходное число 
 * @param {Number} len - какой длины должен быть bin-code. Если на выходе длина получается меньше - спереди доставляются нули
 * @returns {String}
 */
const toBinString = (number = 0, len = 1) => {
    return (str => str.length === len ? str : `${'0'.repeat(len - str.length)}${str}`)((number >>> 0).toString(2))
}

/**
 * ## Функция для умного возведения в степень с модулем (для конструкции `(a ^ b) mod n`)
 * 
 * ### Логика алгоритма:
 * 1) если степень нечетная, то мы превращаем выражение в вид `(a ^ (b - 1) * d) mod n` (т.е. мы забираем 1 разряд из степени)
 * 2) если степерь четная, то просто ее делим на 2 и при этом возводим в квадрат исходное число, т.е.
 * `(a ^ 2 ^ (b / 2)) mod n`
 * 3) если есть d - берем от него mod, так же делаем и с a, т.е.
 * `((a ^ 2 ^ c) * d) mod n` -> `((x ^ c) * y) mod n`
 * Повторем алгоритм, пока степент не станет равной 1
 * 
 * ### Мини пример
 * 1) 140 ^ 283 mod 713
 * 2) 140 ^ 282 * 140 mod 713
 * 3) (140 ^ 2 ^ 141) * 140 mod 713
 * 4) 19600 ^ 141 * 140 mod 713
 * 5) 349 ^ 141 * 140 mod 713
 * 6) 349 ^ 140 * (140 * 349) mod 713
 * 7) 349 ^ 140 * 48860 mod 713
 * 7) 349 ^ 140 * 376 mod 713
 * ....
 * @param {Number} count - исходное число
 * @param {Number} pow - в какую степень он возводиться
 * @param {Number} mod - какой берется модуль
 * @returns {Number} - вычисленное выражение (count ^ pow) % mod;
 */
const smartMod = (count_i, pow_i, mod) => {
    let count = count_i;
    let pow = pow_i;
    let b = 1;

    console.log(`Начало умного возведения ${count} в степень ${pow} по модулю ${mod}...`)

    let message = 'result = ';

    while (pow > 1) {
        if (pow % 2 == 1) {
            message += `((${count} ^ ${pow}) * ${b}) mod ${mod} = `
            b *= count;
            pow = pow - 1;

            message += `((${count} ^ ${pow}) * ${b}) mod ${mod} = `

            b = b % mod;
            message += `((${count} ^ ${pow}) * ${b}) mod ${mod} = `
        } else {
            message += `((${count} ^ 2 ^ ${(pow / 2).toFixed()}) * ${b}) mod ${mod} = `
            pow = (pow / 2).toFixed()

            count = (count ** 2) % mod;

            message += `((${count} ^ ${pow}) * ${b}) mod ${mod} = `
        }
    }

    message += `${(count * b) % mod}`;

    console.log('Реультат умного возведения в степень: ', message)

    return (count * b) % mod;
}

/**
 * ## Функция для получения случайного числа в диапозоне от `min` до `max`
 * 
 * @param {Number} min - min
 * @param {Number} max - max
 * @returns {Number}
 */
const getRandomInt = (min, max)  => {
    return Math.random() * (max - min) + min;
}

/**
 * Функция для сдвига (чтоб не уйти в минус)
 * @param {*} num 
 * @param {*} shift 
 * @returns 
 */
 const r28shl = (num, shift) => {
    return ((num << shift) & 0xfffffff) | (num >>> (28 - shift));
};

const customXor = (left, right) => {
    const result = left.split('').reduce((calc, el, i) => {
        calc += el == right[i] ? '0' : '1';

        return calc;
    }, '');

    return result;
}

module.exports.smartMod = smartMod;
module.exports.getRandomInt = getRandomInt;
module.exports.chunk = chunk;
module.exports.toBinString = toBinString;
module.exports.r28shl = r28shl;
module.exports.customXor = customXor;
