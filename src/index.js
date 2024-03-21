import { PRODUCT_PRICES, generateData } from './generate.js'

const RECORDS_N = 1000

const prices = PRODUCT_PRICES
const records = generateData(RECORDS_N)

// console.table(records)
console.log(prices)

function validateData(array) {
  let validate = []
  validate = array.filter(
    ({ company, product, count }) => company && product && count > 0
  )
  return validate.sort((obj1, obj2) => {
    return obj1.company.match(/\d+/g) - obj2.company.match(/\d+/g)
  })
}
console.log(validateData(records))

function dataMerging(array) {
  return array.reduce((acc, cur) => {
    let foundIndex = acc.findIndex(
      (el) => el.company === cur.company && el.product === cur.product
    )
    if (foundIndex !== -1) {
      let found = acc[foundIndex]
      let updated = { ...found, count: found.count + cur.count }
      acc[foundIndex] = updated
    } else {
      acc.push(cur)
    }
    return acc
  }, [])
}
console.log(dataMerging(validateData(records)))

function mergeData(array) {
  return array.reduce((acc, cur) => {
    let foundIndex = acc.findIndex((el) => el.company === cur.company)
    if (foundIndex !== -1) {
      let found = acc[foundIndex]
      let updated = { ...found }
      updated[cur.product] = (updated[cur.product] || 0) + cur.count
      acc[foundIndex] = updated
    } else {
      acc.push({ company: cur.company, [cur.product]: cur.count })
    }
    return acc
  }, [])
}
console.log(mergeData(dataMerging(validateData(records))))
