import prefectureDataSet from "./dataset/pref.json"
import cityData from "./dataset/city.json"
import countyData from "./dataset/county.json"
import wardData from "./dataset/ward.json"
import combinedData from "./dataset/combined_address.json"

interface City {
  city_roma: string
  wards: Record<string, string> // wards가 있는 경우
}

interface Prefecture {
  pref_roma: string
  cities: Record<string, City>
}

const prefectureData: Record<string, string> = prefectureDataSet
const cityDataSet: Record<string, string> = cityData
const countyDataSet: Record<string, string> = countyData
const wardDataSet: Record<string, string> = wardData
const combinedDataSet: Record<string, Prefecture> = combinedData

export const findPrefecture = (japaneseAddress: string): string | null => {
  return prefectureData[japaneseAddress] || null
}

export const findCity = (japaneseAddress: string): string | null => {
  return cityDataSet[japaneseAddress] || null
}

export const findCounty = (japaneseAddress: string): string | null => {
  return countyDataSet[japaneseAddress] || null
}

export const findWard = (japaneseAddress: string): string | null => {
  return wardDataSet[japaneseAddress] || null
}

const findPrefectureForCombined = (
  japaneseAddress: string
): { prefName: string; romanized: string } | null => {
  const prefecture = Object.keys(combinedData).find((pref) =>
    japaneseAddress.startsWith(pref)
  )
  return prefecture
    ? { prefName: prefecture, romanized: combinedDataSet[prefecture].pref_roma }
    : null
}
const findCityForCombined = (
  prefName: string,
  japaneseAddress: string
): { cityName: string; romanized: string } | null => {
  const prefecture = combinedDataSet[prefName]
  if (!prefecture || !prefecture.cities) return null

  const city = Object.keys(prefecture.cities).find((city) =>
    japaneseAddress.startsWith(city)
  )
  return city
    ? { cityName: city, romanized: prefecture.cities[city].city_roma }
    : null
}

const findWardForCombined = (
  prefName: string,
  cityName: string,
  japaneseAddress: string
): { wardName: string; romanized: string } | null => {
  const city = combinedDataSet[prefName]?.cities[cityName]
  if (!city || !city.wards) return null

  const ward = Object.keys(city.wards).find((ward) =>
    japaneseAddress.startsWith(ward)
  )
  return ward ? { wardName: ward, romanized: city.wards[ward] } : null
}

export const findFullRomanizedAddress = (
  japaneseAddress: string
): string | null => {
  const prefectureResult = findPrefectureForCombined(japaneseAddress)
  if (!prefectureResult) return null

  const { prefName, romanized: prefRomanized } = prefectureResult
  let remainingAddress = japaneseAddress.replace(prefName, "")

  const cityResult = findCityForCombined(prefName, remainingAddress)
  if (!cityResult) return null

  const { cityName, romanized: cityRomanized } = cityResult
  remainingAddress = remainingAddress.replace(cityName, "")

  const wardResult = findWardForCombined(prefName, cityName, remainingAddress)

  if (wardResult) {
    const { wardName, romanized: wardRomanized } = wardResult
    return `${prefRomanized}, ${cityRomanized}, ${wardRomanized}`
  } else {
    return `${prefRomanized}, ${cityRomanized}`
  }
}
