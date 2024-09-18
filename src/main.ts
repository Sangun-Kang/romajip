import {
  findPrefecture,
  findCity,
  findCounty,
  findWard,
  findFullRomanizedAddress,
} from "./romajip"

const testAddress = "東京都港区六本木"
console.log(findPrefecture(testAddress)) // 東京都
console.log(findCity(testAddress)) // 港区
console.log(findCounty(testAddress)) // null
console.log(findWard(testAddress)) // 六本木
console.log(findFullRomanizedAddress(testAddress)) // 'Tokyo, Minato, Roppongi'
