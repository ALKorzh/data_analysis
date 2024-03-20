import { PRODUCT_PRICES, generateData } from './generate.js'

const RECORDS_N = 1000

const prices = PRODUCT_PRICES
const records = generateData(RECORDS_N)

console.table(records)
console.log(prices)

function validateTable() {
  const validate = []
  for (let i = 0; i < RECORDS_N; i++) {
    let flag = true
    for (let key in records[i]) {
      if (!(records[i][key] === '')) {
        if (records[i].count < 0) {
          flag = false
        }
      } else {
        flag = false
        continue
      }
    }
    if (flag) {
      validate.push(records[i])
    }
  }
  return validate
}
console.log(validateTable())
