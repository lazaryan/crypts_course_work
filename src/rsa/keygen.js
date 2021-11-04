
function isCoprime (a, b) {
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

//a * a-1 = 1 mod n
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

const keygen = (p, q) => {
    const n = p * q;
    const fEilr = (p - 1) * (q - 1);

    let e = 1;

    for (let i = 2; i < fEilr; i++) {
        if (isCoprime(i, fEilr)) {
            e = i;
            break;
        }
    }

    const d = gcd(e, fEilr);

    return {
        publicKey: { e, n },
        privateKey: { d, n }
    }
}

module.exports = keygen;
