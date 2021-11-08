//библиотека для работы с путями
const path = require('path');

// подключаем все наши функции
const des = require(path.join(__dirname, '..', 'src', 'des/index.js'));
const gost = require(path.join(__dirname, '..', 'src', 'gost/index.js'));
const {
    keygen: rsaKeygen,
    encryptRSAMessage
} = require(path.join(__dirname, '..', 'src', 'rsa/index.js'));
const hash = require(path.join(__dirname, '..', 'src', 'hash/index.js'));
const ecp = require(path.join(__dirname, '..', 'src', 'ecp/index.js'));
const charsMap = require(path.join(__dirname, '..', 'src', 'common/map.js'));

// получаем доступ к эдементам нашей страницы по id
// к примеру у нас в `public/index.html` есть `<button class="run-calculate" id="runCalculate">Вычислить</button>`
// с помощью `document.getElementById` мы получаем доступ к этой кнопке по ее `ID`
const runAction = document.getElementById('runCalculate');

const firstName = document.getElementById('firstname');
const name = document.getElementById('name');
const lastName = document.getElementById('lastname');

const rsaP = document.getElementById('rsa_p');
const rsaQ = document.getElementById('rsa_q');

const hashP = document.getElementById('hash_p');
const hashQ = document.getElementById('hash_q');

const desWrapper = document.getElementById('dessWrapper');
const rsaWrapper = document.getElementById('rsaWrapper');
const hashWrapper = document.getElementById('hashWrapper');
const ecpWrapper = document.getElementById('espWrapper');
const gostWrapper = document.getElementById('gostWrapper');

// вешам слушать на нажатие кнопки, т.е. когда пользователь нажмет на кнопку,
// произойдет вызов функции
runAction.addEventListener('click', () => {
    //скрываем все кнопки
    desWrapper.style.display = 'none';
    rsaWrapper.style.display = 'none';
    hashWrapper.style.display = 'none';
    ecpWrapper.style.display = 'none';
    gostWrapper.style.display = 'none';

    //получаем сообщение, зашифрованное DES
    const encryptingDESMEssage = calculateDes();

    //вставляем результат на страницу
    document.getElementById('desResult').innerHTML = encryptingDESMEssage;
    //отображаем блок
    desWrapper.style.display = 'block';

    const gostResult = calculateGost();
    //вставляем результат на страницу
    document.getElementById('gostResult').innerHTML = gostResult;
    //отображаем блок
    gostWrapper.style.display = 'block';

    // получаем ключи и зашифрованный текст с помощью алгоритма RSA
    const { keys: rsaKeys, encryptText: rsaEncryptText } = calculateRSA();

    //вставляем данные в разметку
    // rsaKeys - это объект, которые содержит публичный и приватный ключи.
    //Чтоб его отобразить, необходимо провести преобразование в строку, для чего используется JSON.stringify
    //т.е. JSON.stringify({ a: 1, b: 2 }) === "{ a: 1, b: 2 }"
    document.getElementById('rsaKeys').innerHTML = JSON.stringify(rsaKeys);
    document.getElementById('rsaEncryptFIO').innerHTML = rsaEncryptText;
    //отображаем блок
    rsaWrapper.style.display = 'block';

    //дальше логика идентичная

    const resultHash = calculateHash();
    document.getElementById('hashResult').innerHTML = resultHash;
    hashWrapper.style.display = 'block';

    const resultEcp = calculateEcp();
    document.getElementById('ecpResult').innerHTML = resultEcp;
    ecpWrapper.style.display = 'block';
});

/**
 * Функция для преобразования строки в бинарь
 * 
 * @example
 * convertStrToBin('АБ') === '1100000011000001'
 * @param {string} str - исходная строка
 * @returns {string} - строка в виде нулей и единиц
 */
const convertStrToBin = str => {
    return str.split('').map(char => charsMap[char] ? charsMap[char].bin : char.codePointAt()).join('');
}

/**
 * Метод для вычисления алгоритма DES
 * 
 * @returns {string} зашифрованное сообщение
 */
const calculateDes = () => {
    //Для начала вычисляем собощение, которое будем шифровать,
    // а именно первые 8 символов ФИО (ровно Фамилия)

    //ГриценкоДмитрийАндреевич
    const fio = firstName.value + name.value + lastName.value;
    //Гриценко (8 символов)
    const first8Chars = fio.substring(0, 8);
    // 11000011 11110000 11101000 11110110 11100101 11101101 11101010 11101110
    const convertToBinStr = convertStrToBin(first8Chars);

    //В качетсве ключа выступают 8 символов отчества

    //Андрееви
    const initialKey = lastName.value.substring(0, 8);
    //11000000 11101101 11100100 11110000 11100101 11100101 11100010 11101000 
    const convertToBinInitialKey = convertStrToBin(initialKey);

    //шифруем 1 раунд алгоритмом DES
    const desMessage = des(convertToBinStr, convertToBinInitialKey);
    
    return desMessage;
}

/**
 * Метод для вычисления алгоритма шифрования ГОСТ 28147-89
 * 
 * @returns {any}
 */
const calculateGost = () => {
    //Для начала вычисляем собощение, которое будем шифровать,
    // а именно первые 8 символов ФИО (ровно Фамилия)

    //ГриценкоДмитрийАндреевич
    const fio = firstName.value + name.value + lastName.value;
    //Гриценко (8 символов)
    const first8Chars = fio.substring(0, 8);
    // 11000011 11110000 11101000 11110110 11100101 11101101 11101010 11101110
    const convertToBinStr = convertStrToBin(first8Chars);

    //В качетсве ключа выступают 8 символов отчества

    //Андрееви
    const initialKey = lastName.value.substring(0, 4);
    //11000000 11101101 11100100 11110000
    const convertToBinInitialKey = convertStrToBin(initialKey);

    const result = gost(convertToBinStr, convertToBinInitialKey)

    return result;
}

/**
 * Функция для выисления для алгоритма RSA
 * @returns {Object} keys - сгененрированные ключи, encryptText - зашифрованное на этих ключах сообщение
 */
const calculateRSA = () => {
    //получаем наши инициалы (ФИО)
    const initials = firstName.value[0] + name.value[0] + lastName.value[0];
    //преобразовываем в бинарную строку
    const convertInitials = convertStrToBin(initials);

    // сгенерировали ключи
    const keys = rsaKeygen(+rsaP.value || 0, +rsaQ.value || 0);

    // шифруем наше ФИО с помощью сгенерированных ключей
    const encryptText = encryptRSAMessage(convertInitials, keys);

    return {
        keys,
        encryptText
    }
}

/**
 * Функция для вычисления Hash
 * 
 * @returns {String}
 */
const calculateHash = () => {
    //Получаем нашу Фамилию
    const firstname = firstName.value;

    //считаем хеш с использование P, Q, которые мы ввели в поля ввода
    const hashResult = hash(firstname, +rsaP.value || 1, +rsaQ.value || 1)

    return hashResult;
}

/**
 * Функция для вычисления цифровой подписи
 * 
 * @returns {String}
 */
const calculateEcp = () => {
    //получаем, что мы получили в результате хеширования
    const hashResult = document.getElementById('hashResult').innerHTML;

    //подписываем наш хеш
    //для этого генрируем RSA ключи на основе того, что ввели в поля ввода
    const resultEcp = ecp(+hashResult, rsaKeygen(+hashP.value || 1, +hashQ.value || 1));

    return resultEcp;
}