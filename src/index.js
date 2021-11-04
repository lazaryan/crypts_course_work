const path = require('path');

const des = require(path.join(__dirname, '..', 'src', 'des/index.js'));
const {
    keygen: rsaKeygen,
    encryptRSAMessage
} = require(path.join(__dirname, '..', 'src', 'rsa/index.js'));
const hash = require(path.join(__dirname, '..', 'src', 'hash/index.js'));
const ecp = require(path.join(__dirname, '..', 'src', 'ecp/index.js'));
const charsMap = require(path.join(__dirname, '..', 'src', 'common/map.js'));

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

runAction.addEventListener('click', () => {
    desWrapper.style.display = 'none';
    rsaWrapper.style.display = 'none';
    hashWrapper.style.display = 'none';
    ecpWrapper.style.display = 'none';

    const encryptingDESMEssage = calculateDes();

    document.getElementById('desResult').innerHTML = encryptingDESMEssage;
    desWrapper.style.display = 'block';

    const { keys: rsaKeys, encryptText: rsaEncryptText } = calculateRSA();

    document.getElementById('rsaKeys').innerHTML = JSON.stringify(rsaKeys);
    document.getElementById('rsaEncryptFIO').innerHTML = rsaEncryptText;
    rsaWrapper.style.display = 'block';

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

const calculateRSA = () => {
    //получаем наши инициалы (ФИО)
    const initials = firstName.value[0] + name.value[0] + lastName.value[0];
    //преобразовываем в бинарную строку
    const convertInitials = convertStrToBin(initials);
    console.log(convertInitials)

    // сгенерировали ключи
    const keys = rsaKeygen(+rsaP.value || 0, +rsaQ.value || 0);

    const encryptText = encryptRSAMessage(convertInitials, keys);

    return {
        keys,
        encryptText
    }
}

const calculateHash = () => {
    const firstname = firstName.value;
    //преобразовываем в бинарную строку
    const convertFirstname = convertStrToBin(firstname);

    const hashResult = hash(convertFirstname, +rsaP.value || 1, +rsaQ.value || 1)

    return hashResult;
}

const calculateEcp = () => {
    const hashResult = document.getElementById('hashResult').innerHTML;

    const resultEcp = ecp(+hashResult, rsaKeygen(+hashP.value || 1, +hashQ.value || 1));

    return resultEcp;
}