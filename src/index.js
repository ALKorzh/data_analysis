import { PRODUCT_PRICES, generateData } from './generate.js'

const RECORDS_N = 1000

const prices = PRODUCT_PRICES
const records = generateData(RECORDS_N)

console.table(records)
console.log(prices)
