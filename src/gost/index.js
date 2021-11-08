const { toBinString, chunk, r28shl } = require('../common/utils')

const P = [
  [1, 13, 4, 6, 7, 5, 14, 4],
  [15, 11, 11, 12, 13, 8, 11, 10],
  [13, 4, 10, 7, 10, 1, 4, 9],
  [0, 1, 0, 1, 1, 13, 12, 2],
  [5, 3, 7, 5, 0, 10, 6, 13],
  [7, 15, 2, 15, 8, 3, 13, 8],
  [10, 5, 1, 13, 9, 4, 15, 0],
  [4, 9, 13, 8, 15, 2, 10, 14],
  [9, 0, 3, 4, 14, 14, 2, 6],
  [2, 10, 6, 10, 4, 15, 3, 11],
  [3, 14, 8, 9, 6, 12, 8, 1],
  [14, 7, 5, 14, 12, 7, 1, 12],
  [6, 6, 9, 0, 11, 6, 0, 7],
  [11, 8, 12, 3, 2, 0, 7, 15],
  [8, 2, 15, 11, 5, 9, 5, 5],
  [12, 12, 14, 2, 3, 11, 9, 3]
]

const f = (text = '', key = '') => {
  const result = parseInt(text, 2) + parseInt(key, 2);

  const resultBin = result.toString(2);

  const resultMax32 = resultBin.length === 33 ? '1' + resultBin.substring(2) : resultBin;

  const resultSum32 = toBinString(parseInt(resultMax32, 2), 32);

  const chunkArray = chunk(resultSum32, 4);

  const resultP = chunkArray.map((item, i, arr) => {
    const count = parseInt(item, 2);
    const index = arr.length - i;

    return P[count - 1][index - 1].toString(2);
  }).join('');

  const shiftResult = r28shl(parseInt(resultP, 2), 11);

  return shiftResult;
}

const gost = (message = '', firstKey = '') => {
  const left = message.substring(0, 32);
  const right = message.substring(32);

  const resultF1 = f(right, firstKey);

  const xor = (parseInt(left, 2) ^ resultF1) >>> 0;

  return xor;
}

module.exports = gost;
