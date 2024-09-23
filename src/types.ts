export interface AddressData {
  [prefecture: string]: Prefecture
}

export interface Prefecture {
  v: string
  [city: string]: City | string
}

export interface City {
  v: string
  [ward: string]: string
}

export interface ParsedAddress {
  pref: string
  city: string
  ward: string
  other: string
  pref_roma: string
  city_roma: string
  ward_roma: string
  other_roma: string
}
