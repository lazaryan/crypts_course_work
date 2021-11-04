const hash = (message, p, q) => {
    const n = p * q;
    let h = 5; // константа варианта

    message.split('').map(char => {
        const code = char.charCodeAt();

        h = ((code + h) ** 2) % n;
    })

    return h;
}

module.exports = hash;
