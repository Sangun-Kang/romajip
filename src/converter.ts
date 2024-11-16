import addressDataRaw from "./addresses.json"
import { AddressData, AddressNode, ParsedAddress } from "./types"
import {
  SUFFIX_PATTERNS,
  PREFIX_PATTERNS,
  SPECIAL_LOCATION_PATTERNS,
  SPECIAL_REGIONS,
  PREFECTURE_PATTERNS,
  type SpecialLocationKey,
} from "./patterns"

const memoizedResults = new Map<string, ParsedAddress>()
let addressDataCache: AddressData | null = null

// 정규식 패턴 수정
const NUMBER_PATTERN = /(\d+丁目)?(?:(\d+(?:-\d+)*)(番地?|号)?)?$/

const extractNumber = (
  address: string
): { number: string; remaining: string } => {
  const match = address.match(NUMBER_PATTERN)

  if (match) {
    // 매치된 전체 문자열 구하기
    const fullMatch = match[0]
    if (!fullMatch) {
      return { number: "", remaining: address.trim() }
    }

    // 개별 부분 처리
    const parts = []
    if (match[1]) parts.push(match[1]) // 丁目
    if (match[2]) {
      // 번지/번호
      const numbers = match[2]
      const suffix = match[3] || "" // 番地/号 접미사
      parts.push(numbers + suffix)
    }

    if (parts.length === 0) {
      return { number: "", remaining: address.trim() }
    }

    return {
      number: parts.join(""),
      remaining: address.slice(0, -fullMatch.length).trim(),
    }
  }

  return { number: "", remaining: address.trim() }
}

const formatNumber = (number: string): string => {
  if (!number) return ""

  let result = number

  // 丁目 처리
  const chomeMatch = result.match(/(\d+)丁目/)
  if (chomeMatch) {
    result = result.replace(/(\d+)丁目/, `${chomeMatch[1]}chome`)
  }

  // 번지/번호 처리
  result = result
    .replace(/(\d+(?:-\d+)*)番地?/, "$1ban")
    .replace(/(\d+(?:-\d+)*)号/, "$1go")

  return result
}

const getAddressData = (): AddressData => {
  if (!addressDataCache) {
    addressDataCache = addressDataRaw as AddressData
  }
  return addressDataCache
}

const handleCompoundName = (name: string): string => {
  let processed = name

  // 특수 패턴 처리
  if (processed.includes("-m") && !processed.includes("-machi")) {
    processed = processed.replace(/-m$/, "-machi")
  }
  if (processed.includes("-c") && !processed.includes("-cho")) {
    processed = processed.replace(/-c$/, "-cho")
  }
  if (processed.includes("-s") && !processed.includes("-shi")) {
    processed = processed.replace(/-s$/, "-shi")
  }

  // 복합 지명 처리
  processed = processed
    .replace(/の/g, "-no-")
    .replace(/島町/g, "shima-cho")
    .replace(/([町村郷])/g, (match) => {
      if (match in SPECIAL_LOCATION_PATTERNS) {
        const key = match as SpecialLocationKey
        return `-${SPECIAL_LOCATION_PATTERNS[key]}`
      }
      return match
    })
    .replace(/--/g, "-")

  return processed
}
const expandRomaji = (compressed: string, original: string): string => {
  // 특별 지역은 그대로 반환
  if ((Object.values(SPECIAL_REGIONS) as string[]).includes(compressed)) {
    return compressed
  }

  // 도도부현은 이미 완전한 형태이므로 처리하지 않음
  if (compressed.endsWith("-ken")) {
    return compressed
  }

  let expanded = compressed

  // 접두사 확장
  Object.entries(PREFIX_PATTERNS).forEach(([long, short]) => {
    if (expanded.startsWith(short)) {
      expanded = `${long}-${expanded.slice(short.length)}`
    }
  })

  // 접미사 확장
  Object.entries(SUFFIX_PATTERNS).forEach(([long, short]) => {
    const pattern = new RegExp(`-${short}$`)
    if (pattern.test(expanded)) {
      expanded = expanded.replace(pattern, `-${long}`)
    }
  })

  // 복합 지명 처리
  if (
    original.includes("の") ||
    original.includes("島") ||
    original.includes("町") ||
    original.includes("村") ||
    original.includes("郷")
  ) {
    expanded = handleCompoundName(expanded)
  }

  return expanded
}

const findLongestMatch = (
  address: string,
  currentDict: { [key: string]: AddressNode }
): {
  matched: string
  node: AddressNode
  remaining: string
} | null => {
  const sortedKeys = Object.keys(currentDict).sort(
    (a, b) => b.length - a.length
  )

  for (const key of sortedKeys) {
    if (address.startsWith(key)) {
      return {
        matched: key,
        node: currentDict[key],
        remaining: address.slice(key.length),
      }
    }
  }

  return null
}

export const parseJapaneseAddress = (address: string): ParsedAddress | null => {
  const cachedResult = memoizedResults.get(address)
  if (cachedResult) {
    return cachedResult
  }

  const data = getAddressData()
  const result: ParsedAddress = {
    japanese: [],
    romaji: [],
  }

  const { number, remaining } = extractNumber(address)
  let currentAddress = remaining
  let currentDict = data

  while (currentAddress.length > 0) {
    const match = findLongestMatch(currentAddress, currentDict)

    if (!match) {
      const compoundMatch = Object.keys(currentDict)
        .sort((a, b) => b.length - a.length)
        .find((key) => {
          const keyParts = key.split(/[のじま町村郷]/)
          return keyParts.every((part) => currentAddress.includes(part))
        })

      if (compoundMatch) {
        result.japanese.push(compoundMatch)
        result.romaji.push(
          expandRomaji(currentDict[compoundMatch].r, compoundMatch)
        )
        currentDict = currentDict[compoundMatch].c || {}
        currentAddress = currentAddress.slice(compoundMatch.length)
        continue
      }

      if (result.japanese.length === 0) {
        return null
      }
      break
    }

    result.japanese.push(match.matched)
    result.romaji.push(expandRomaji(match.node.r, match.matched))
    currentDict = match.node.c || {}
    currentAddress = match.remaining
  }
  if (number) {
    result.japanese.push(number)
    result.romaji.push(formatNumber(number))
  }

  memoizedResults.set(address, result)

  return result
}
