import { PRODUCT_PRICES, generateData } from './generate.js'

const table = document.querySelector('#table')
const container = document.querySelector('.container')

const RECORDS_N = 1000

const prices = PRODUCT_PRICES
const records = generateData(RECORDS_N)

// data processes
function validateData(array) {
  let validate = []
  validate = array.filter(
    ({ company, product, count }) => company && product && count > 0
  )
  return validate.sort((obj1, obj2) => {
    return obj1.company.match(/\d+/g) - obj2.company.match(/\d+/g)
  })
}

function productDataMerging(array) {
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

function companyMergeData(array) {
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

function updateObjects(productPrices, companyProducts) {
  let keys = new Map(Object.entries(productPrices))

  for (let i = 0; i < companyProducts.length; i++) {
    let companyProduct = companyProducts[i]
    let updatedProduct = {}

    let firstKey = Object.keys(companyProduct)[0]
    updatedProduct[firstKey] = companyProduct[firstKey]

    for (let [key, value] of keys) {
      if (key !== firstKey && !(key in companyProduct)) {
        updatedProduct[key] = 0
      } else if (key !== firstKey) {
        updatedProduct[key] = companyProduct[key]
      }
    }

    companyProducts[i] = updatedProduct
  }

  return companyProducts
}

const companyProducts = updateObjects(
  prices,
  companyMergeData(productDataMerging(validateData(records)))
)

//render
function renderHeader(prices) {
  let row = table.insertRow(-1)
  let productCounter = 0
  for (let i = 0; i <= Object.keys(prices).length * 2 + 2; i++) {
    let cell = row.insertCell(i)
    if (i == 0) {
      cell.innerHTML = 'Компания'
      continue
    }
    if (i == Object.keys(prices).length * 2 + 1) {
      cell.innerHTML = 'Итого (руб)'
      continue
    }
    if (i == Object.keys(prices).length * 2 + 2) {
      cell.innerHTML = '%'
      continue
    }
    if (i % 2 != 0) {
      productCounter++
      cell.innerHTML = `${Object.keys(prices)[productCounter - 1]} (шт.)`
      continue
    }
    if (i % 2 == 0) {
      cell.innerHTML = `${Object.keys(prices)[productCounter - 1]} (руб.)`
      continue
    }
  }
}

function renderBody(prices, data) {
  let grandTotal = 0
  for (let i = 0; i < data.length; i++) {
    let total = 0
    for (let j = 0; j < Object.keys(prices).length; j++) {
      total += data[i][Object.keys(prices)[j]] * prices[Object.keys(prices)[j]]
    }
    grandTotal += total
  }

  for (let i = 0; i < data.length; i++) {
    let row = table.insertRow(-1)
    let productCounter = 0
    let total = 0

    for (let j = 0; j <= Object.keys(prices).length * 2 + 2; j++) {
      let cell = row.insertCell(j)
      if (j == 0) {
        cell.innerHTML = `${data[i][Object.keys(data[i])[j]]}`
        continue
      }
      if (j == Object.keys(prices).length * 2 + 1) {
        cell.innerHTML = `${total.toFixed(2)}`
        continue
      }
      if (j == Object.keys(prices).length * 2 + 2) {
        cell.innerHTML = `${((total / grandTotal) * 100).toFixed(2)}%`
        continue
      }

      if (j % 2 != 0) {
        productCounter++
        cell.innerHTML = `${data[i][Object.keys(prices)[productCounter - 1]]}`
        continue
      }
      if (j % 2 == 0) {
        cell.innerHTML = `${(
          data[i][Object.keys(prices)[productCounter - 1]] *
          prices[Object.keys(prices)[productCounter - 1]]
        ).toFixed(2)}`

        total += +(
          data[i][Object.keys(prices)[productCounter - 1]] *
          prices[Object.keys(prices)[productCounter - 1]]
        ).toFixed(2)
        continue
      }
    }
  }
}

function paginateAndRender(page_size, page_number, prices, data) {
  container.innerHTML = ''

  let btnPrev = document.createElement('button')
  btnPrev.innerHTML = 'Предыдущая'
  btnPrev.onclick = function () {
    if (page_number > 1) {
      paginateAndRender(page_size, page_number - 1, prices, data)
      renderTotal()
    }
  }

  let btnNext = document.createElement('button')
  btnNext.innerHTML = 'Следующая'
  btnNext.onclick = function () {
    if (page_number < Math.ceil(data.length / page_size)) {
      paginateAndRender(page_size, page_number + 1, prices, data)
      renderTotal()
    }
  }

  container.appendChild(btnPrev)
  container.appendChild(btnNext)

  let select = document.createElement('select')
  select.onchange = function () {
    paginateAndRender(parseInt(this.value), 1, prices, data)
    renderTotal()
  }
  ;[10, 50, 100].forEach(function (num) {
    let option = document.createElement('option')
    option.value = num
    option.text = num
    select.appendChild(option)
  })

  container.appendChild(select)

  table.innerHTML = ''
  renderHeader(prices)
  let paginatedData = paginate(page_size, page_number, data)
  renderBody(prices, paginatedData)

  container.appendChild(table)

  let btnRefresh = document.createElement('button')
  btnRefresh.innerHTML = 'Обновить'
  btnRefresh.onclick = function () {
    paginateAndRender(parseInt(select.value), 1, prices, data)
    renderTotal()
  }

  container.appendChild(btnRefresh)
}

paginateAndRender(10, 1, prices, companyProducts)

function paginate(page_size, page_number, data) {
  let start = (page_number - 1) * page_size
  let end = page_number * page_size

  return data.slice(start, end)
}

function createRowsArray() {
  let rowsArray = []
  for (let i = 0; i < table.rows.length; i++) {
    let row = table.rows[i]
    let cellsArray = []
    for (let j = 0; j < row.cells.length; j++) {
      let cell = row.cells[j]
      cellsArray.push(cell.innerText)
    }
    rowsArray.push(cellsArray)
  }
  return rowsArray
}

function calculateTotalCost(rowsArray) {
  let totalCost = 0
  for (let i = 1; i < rowsArray.length; i++) {
    totalCost += +rowsArray[i][rowsArray[i].length - 2]
  }
  return totalCost
}

function renderTotal() {
  let rowsArray = createRowsArray()
  let totalCost = calculateTotalCost(rowsArray)
  let row = table.insertRow(-1)
  for (let i = 0; i <= Object.keys(prices).length * 2 + 2; i++) {
    let cell = row.insertCell(i)
    if (i == 0) {
      cell.innerHTML = 'Сумма всех продаж'
      continue
    }
    if (i == Object.keys(prices).length * 2 + 1) {
      cell.innerHTML = `${totalCost.toFixed(2)}`
      continue
    } else {
      cell.innerHTML = '-'
    }
  }
}

renderTotal()
