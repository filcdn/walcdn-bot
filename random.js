import assert from 'node:assert'

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export const pickRandomNumber = (min, max) => {
  assert(min <= max, 'min must be less than or equal to max')

  return Math.floor(Math.random() * (max - min)) + min
}

/**
 * Picks a random item from an array.
 *
 * @param {any[]} arr
 * @returns {any}
 */
export const pickRandomItem = (arr) => {
  return arr[pickRandomNumber(0, arr.length - 1)]
}
