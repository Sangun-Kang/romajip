export const SUFFIX_PATTERNS = {
  shi: "s",
  ku: "k",
  cho: "c",
  machi: "m",
  gun: "g",
  ken: "k", // ken으로 표시
  chome: "h",
  dori: "d",
  kita: "kt",
  minami: "mn",
  higashi: "hg",
  nishi: "ns",
  mura: "mr",
  gawa: "gw",
} as const

// 특별 지역 처리
export const SPECIAL_REGIONS = {
  北海道: "hokkaido", // 홋카이도
  東京都: "tokyo", // 도쿄도
  大阪府: "osaka", // 오사카부
  京都府: "kyoto", // 교토부
} as const

// 도도부현 처리 (특별 지역 제외)
export const PREFECTURE_PATTERNS = {
  県: "-ken", // 그 외 현
} as const

export const PREFIX_PATTERNS = {
  north: "n-",
  south: "s-",
  east: "e-",
  west: "w-",
  central: "c-",
  upper: "u-",
  lower: "l-",
  new: "n-",
} as const

export const SPECIAL_LOCATION_PATTERNS = {
  の: "no",
  島: "shima",
  町: "cho",
  村: "mura",
  郷: "go",
} as const

export type SpecialLocationKey = keyof typeof SPECIAL_LOCATION_PATTERNS
export type SpecialRegionKey = keyof typeof SPECIAL_REGIONS
