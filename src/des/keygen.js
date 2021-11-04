// первый блок перестановок, через который проходит исходный ключ
var PC1 = [
    57, 49, 41, 33, 25, 17, 9,  1,
    58, 50, 42, 34, 26, 18, 10, 2,
    59, 51, 43, 35, 27, 19, 11, 3,
    60, 52, 44, 36, 63, 55, 47, 39,
    31, 23, 15, 7,  62, 54, 46, 38,
    30, 22, 14, 6,  61, 53, 45, 37,
    29, 21, 13, 5,  28, 20, 12, 4
];

// второй блок перестановок, через который проходят все сгенерированные подключи
var PC2 = [
    14, 17, 11, 24, 1,  5,
    3,  28, 15, 6,  21, 10,
    23, 19, 12, 4,  26, 8,
    16, 7,  27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
];

// Сдвиг каждого шага генерации подключа
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1]

/**
 * ## Функция разбиения массива на n равных частей
 *
 * @param {Array<any>} myArray - исходный массив
 * @param {Number} chunkSize - на сколько равных блоков разбить массив
 * @returns {Array<Array<any>>}
 */
const chunkArray = (myArray, chunk_size) => {
    var results = [];
    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }
    return results;
}

/**
 * Функция для сдвига (чтоб не уйти в минус)
 * @param {*} num 
 * @param {*} shift 
 * @returns 
 */
function r28shl(num, shift) {
    return ((num << shift) & 0xfffffff) | (num >>> (28 - shift));
};

/**
 * ## Функция для генерации ключей алгоритма DES
 * 
 * @param {String} keyBits : текст длиной 56 (бинарный), на основе которого создаются ключи
 * @returns {Array<String>} : массив ключей
 */
const keygen = (keyWords = '') => {
    const keys = []

    //56 -> 64 (в каждом отделе по 8 бит нечетное число единиц)
    const keyWords64 = chunkArray(keyWords.split('').map(i => +i), 7).map(list => {
        const count = list.reduce((calc, item) => (calc += parseInt(item), calc), 0)

        list.push(count % 2 ? 0 : 1)

        return list
    }).flat()

    // прогнали через блок перестановки
    const permutatedKeyWords = PC1.map(key => keyWords64[key])

    // разбиваем слово на 2 равные части по 28 бит
    let left = parseInt(permutatedKeyWords.slice(0, 28).join(''), 2);
    let right = parseInt(permutatedKeyWords.slice(28).join(''), 2);

    for (i of SHIFTS) {
        //сдвигаем обе части на i бит
        left = r28shl(left, i);
        right = r28shl(right, i);
        
        //формируем ключ длиной 56 бит
        const newKey = (key => key.length === 56 ? key : `${'0'.repeat(56 - key.length)}${key}`)(left.toString(2) + right.toString(2));
        //прогоняем его через блок перестановки PC2
        const permutatedNewKey = parseInt(PC2.map(item => newKey[item - 1]).join(''), 2);

        keys.push(permutatedNewKey)
    }

    return keys;
}

module.exports = keygen;
