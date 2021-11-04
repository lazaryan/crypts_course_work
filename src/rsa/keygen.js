/**
 * ## Функция для проверки, являются ли числа `a` и `b` взаимнопростыми, т.е. их НОД (наибольший общий делитель) = 1
 * 
 * @param {Number} a 
 * @param {Number} b 
 * @returns {Boolean}
 */
const isCoprime = (a, b) => {
	var num;
	while ( b ) {
		num = a % b;
		a = b;
		b = num;
	}
	if (Math.abs(a) == 1) {
		return true;
	}

	return false;
}

/**
 * ## Функция для поиска мультиплекативно-обратного
 * 
 * Используется расширенный алгоритм Эвклида
 * 
 * Мультиплкативнообратное - это такое число b для чисел a и n, что `(a * b) = 1 mod n`,
 * т.е. при взятик mod a * b от n в остатке останется 1 (к примеру 26 === 1 mod n, т.к. 26 % 25 = 1)
 * 
 * @param {Number} a 
 * @param {Number} n 
 * @returns {Number} - b
 */
const gcd = (a, n) => {
    let [x1, x2, x3] = [1, 0, n];
    let [y1, y2, y3] = [0, 1, a];

    while (true) {
        if (!y3) {
            throw new Error("Мультиплекативнообратного не существует!")
        }

        if (y3 == 1) {
            return y2 > 0 ? y2 : y2 + n;
        }

        const q = Math.floor(x3 / y3);

        const [t1, t2, t3] = [x1 - q*y1, x2 - q*y2, x3 - q*y3];

        [x1, x2, x3] = [y1, y2, y3];
        [y1, y2, y3] = [t1, t2, t3];
    }
}

/**
 * ## Функция для вычисления ключей для алгоритма RSA
 * 
 * P и Q должны быть взаимнопростыми, т.е. их НОД === 1
 * 
 * @param {Number} p 
 * @param {Number} q 
 * @returns {Object}
 */
const keygen = (p, q) => {
    const n = p * q;
    //Считаем функцию Эйлира, которая показывает, сколько есть простых делителей числа n
    const fEilr = (p - 1) * (q - 1);

    let e = 1;

    //ищем число e, которое 1 < e < fEilr и при этом взаимнопростое с fEilr
    for (let i = 2; i < fEilr; i++) {
        if (isCoprime(i, fEilr)) {
            e = i;
            break;
        }
    }

    // считаем мультиплекативнообратное для e и fEilr
    const d = gcd(e, fEilr);

    return {
        publicKey: { e, n },
        privateKey: { d, n }
    }
}

module.exports = keygen;
