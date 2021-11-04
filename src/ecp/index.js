const { smartMod } = require('../common/utils')

const ecp = (message, keys) => {
    console.log(message, keys.privateKey, smartMod(message, keys.privateKey.d, keys.privateKey.n));
    //return smartMod(message, keys.privateKey.d, keys.privateKey.n)

    return smartMod(message, keys.privateKey.d, keys.privateKey.n)
}

module.exports = ecp;
