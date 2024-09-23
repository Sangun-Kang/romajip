import addressDataRaw from "./addresses.json"
import { AddressData, ParsedAddress, Prefecture, City } from "./types"

/**
 * AddressData Cahcing
 */
let addressDataCache: AddressData | null = null

/**
 * 데이터셋을 캐시에 로드
 */
const getAddressData = (): AddressData => {
  if (!addressDataCache) {
    addressDataCache = addressDataRaw as AddressData
  }
  return addressDataCache
}

/**
 * '丁目', '番', '号' 등을 추출
 */
const extractOther = (
  address: string
): { other: string; remaining: string } => {
  const regex = /(\d+丁目\d+-\d+)$/
  const match = address.match(regex)
  if (match) {
    return { other: match[1], remaining: address.replace(regex, "") }
  }
  return { other: "", remaining: address }
}

/**
 * 도도부현 탐색
 */
const findPrefecture = (
  address: string,
  data: AddressData
): { pref: string; pref_roma: string; remaining: string } | null => {
  const prefectures = Object.keys(data)
  for (const pref of prefectures) {
    if (address.startsWith(pref)) {
      return {
        pref,
        pref_roma: data[pref].v,
        remaining: address.slice(pref.length),
      }
    }
  }
  return null
}

/**
 * 시구정촌 탐색
 */
const findCity = (
  address: string,
  prefectureData: Prefecture
): { city: string; city_roma: string; remaining: string } | null => {
  const cities = Object.keys(prefectureData).filter((key) => key !== "v")
  for (const city of cities) {
    if (address.startsWith(city)) {
      const cityData = prefectureData[city] as City
      return {
        city,
        city_roma: cityData.v,
        remaining: address.slice(city.length),
      }
    }
  }
  return null
}

/**
 * Ward를 탐색(사실상 大字、小字이지만, 뭉쳐서 Ward라고 표현했음!!)
 */
const findWard = (
  address: string,
  cityData: City
): { ward: string; ward_roma: string; remaining: string } | null => {
  const wards = Object.keys(cityData).filter((key) => key !== "v")
  for (const ward of wards) {
    if (address.startsWith(ward)) {
      return {
        ward,
        ward_roma: cityData[ward],
        remaining: address.slice(ward.length),
      }
    }
  }
  return null
}

/**
 * 전체 주소를 파싱
 */
export const parseJapaneseAddress = (address: string): ParsedAddress | null => {
  const data = getAddressData()

  // 1. 도도부현 찾기
  const prefResult = findPrefecture(address, data)
  if (!prefResult) return null

  const { pref, pref_roma, remaining: afterPref } = prefResult

  // 2. 시구정촌 찾기
  const prefectureData = data[pref] as Prefecture
  const cityResult = findCity(afterPref, prefectureData)
  if (!cityResult) return null

  const { city, city_roma, remaining: afterCity } = cityResult

  // 3. 동(ward) 찾기
  const cityData = prefectureData[city] as City
  const wardResult = findWard(afterCity, cityData)
  if (!wardResult) return null

  const { ward, ward_roma, remaining: afterWard } = wardResult

  // 4. '番', '号' 추출
  const otherResult = extractOther(afterWard)
  const other = otherResult.other
  const other_roma = other.replace(/丁目/g, "-")

  return {
    pref,
    city,
    ward,
    other,
    pref_roma,
    city_roma,
    ward_roma,
    other_roma,
  }
}
