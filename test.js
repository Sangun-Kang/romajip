// test.js
import { romajip } from "./dist/romajip.js"
import { performance } from "node:perf_hooks"

const testAddresses = [
  // 대도시 - 도쿄
  "東京都千代田区丸の内1丁目",
  "東京都新宿区西新宿2丁目8番1号",
  "東京都渋谷区神南1丁目23-1",
  "東京都港区六本木6丁目10-1",
  "東京都中央区銀座4丁目1",
  "東京都品川区大崎1丁目11-2",
  "東京都台東区上野7丁目",
  "東京都豊島区東池袋1丁目",
  "東京都文京区本郷3丁目",
  "東京都江東区豊洲6丁目",

  // 대도시 - 오사카
  "大阪府大阪市中央区難波5丁目1-60",
  "大阪府大阪市北区梅田3丁目1-3",
  "大阪府大阪市浪速区恵美須東1丁目",
  "大阪府堺市堺区市之町東1丁目",
  "大阪府大阪市阿倍野区阿倍野筋1丁目",
  "大阪府大阪市天王寺区悲田院町10-48",
  "大阪府豊中市玉井町1丁目",
  "大阪府吹田市垂水町1丁目",
  "大阪府枚方市岡東町12-1",
  "大阪府東大阪市小阪1丁目",

  // 대도시 - 후쿠오카
  "福岡県福岡市中央区天神2丁目",
  "福岡県福岡市博多区博多駅中央街1-1",
  "福岡県福岡市西区愛宕3丁目1-25",
  "福岡県福岡市早良区百道浜2丁目",
  "福岡県北九州市小倉北区浅野2丁目",
  "福岡県久留米市城南町15-3",
  "福岡県大牟田市有明町2丁目",
  "福岡県春日市春日公園6丁目",
  "福岡県太宰府市宰府3丁目",
  "福岡県福津市中央3丁目",

  // 중소도시
  "茨城県つくば市吾妻2丁目",
  "群馬県高崎市八島町70",
  "新潟県長岡市大手通2丁目",
  "石川県金沢市広坂1丁目",
  "静岡県浜松市中区砂山町320-2",
  "岐阜県岐阜市神田町8丁目",
  "愛知県豊橋市駅前大通1丁目",
  "三重県津市丸之内34-5",
  "滋賀県大津市におの浜1丁目",
  "奈良県奈良市登大路町30",

  // 지방 소도시
  "青森県むつ市金谷2丁目",
  "秋田県横手市旭川1丁目",
  "山形県酒田市本町2丁目",
  "福島県会津若松市東栄町1-1",
  "富山県氷見市比美町16-15",
  "福井県敦賀市白銀町1-1",
  "山梨県甲府市丸の内1丁目",
  "長野県諏訪市高島1丁目",
  "和歌山県田辺市新屋敷町1",
  "鳥取県米子市加茂町2丁目",

  // 시골 지역
  "北海道斜里郡斜里町本町4",
  "岩手県下閉伊郡山田町八幡町3-20",
  "宮城県牡鹿郡女川町女川浜字大原1-1",
  "山形県最上郡金山町金山456-1",
  "新潟県南魚沼郡湯沢町大字神立1",
  "長野県北安曇郡白馬村大字北城5034",
  "岐阜県大野郡白川村飯島410",
  "三重県度会郡玉城町田丸114-2",
  "島根県隠岐郡隠岐の島町城北町1",
  "高知県土佐郡土佐町土居194",

  // 섬 지역
  "沖縄県那覇市久茂地3丁目",
  "沖縄県石垣市美崎町1",
  "沖縄県宮古島市平良字西里7",
  "長崎県対馬市厳原町今屋敷669",
  "長崎県五島市東浜町1-1",
  "鹿児島県奄美市名瀬幸町25-8",
  "東京都大島町元町1丁目",
  "東京都八丈島八丈町大賀郷2345",
  "島根県隠岐郡隠岐の島町港町天神原",
  "新潟県佐渡市両津湊198",
  "福岡県福岡市西区愛宕3丁目15-8-1",
]

// 주소 변환 테스트
console.log("=== 주소 변환 테스트 ===\n")
testAddresses.forEach((address, index) => {
  const res = romajip(address)
  console.log(res)
})

// 성능 테스트
console.log("=== 성능 테스트 ===\n")

// 단일 변환 성능
const singleConversionTest = () => {
  const start = performance.now()
  romajip(testAddresses[0])
  const end = performance.now()
  return end - start
}

// 배치 변환 성능
const batchConversionTest = () => {
  const start = performance.now()
  testAddresses.forEach((addr) => romajip(addr))
  const end = performance.now()
  return end - start
}

// 반복 테스트
const iterations = 100
let singleTimes = []
let batchTimes = []

for (let i = 0; i < iterations; i++) {
  singleTimes.push(singleConversionTest())
  batchTimes.push(batchConversionTest())
}

// 결과 분석
const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length
const median = (arr) => {
  const sorted = [...arr].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid]
}

console.log("단일 주소 변환 성능:")
console.log(`평균: ${average(singleTimes).toFixed(3)}ms`)
console.log(`중앙값: ${median(singleTimes).toFixed(3)}ms`)
console.log(`최소: ${Math.min(...singleTimes).toFixed(3)}ms`)
console.log(`최대: ${Math.max(...singleTimes).toFixed(3)}ms\n`)

console.log("100개 주소 배치 변환 성능:")
console.log(`평균: ${average(batchTimes).toFixed(3)}ms`)
console.log(`중앙값: ${median(batchTimes).toFixed(3)}ms`)
console.log(`최소: ${Math.min(...batchTimes).toFixed(3)}ms`)
console.log(`최대: ${Math.max(...batchTimes).toFixed(3)}ms`)
console.log(
  `주소당 평균 처리 시간: ${(
    average(batchTimes) / testAddresses.length
  ).toFixed(3)}ms`
)
