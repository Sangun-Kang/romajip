export interface AddressNode {
  r: string // romaji
  c?: {
    // children (optional)
    [key: string]: AddressNode
  }
}

export interface AddressData {
  [key: string]: AddressNode
}

export interface ParsedAddress {
  japanese: string[]
  romaji: string[]
}
