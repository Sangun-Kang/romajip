import { parseJapaneseAddress } from "./romajip"

/**
 * Function that parses a Japanese address and converts it to English
 * @param address - Japanese address
 * @returns Parsed address object or null
 */
export const romajip = (address: string) => {
  return parseJapaneseAddress(address)
}
