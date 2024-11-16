<p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Sangun-Kang/romajip/blob/main/img/romajip.svg?raw=true">
      <img alt="romajip" src="https://github.com/Sangun-Kang/romajip/blob/main/img/romajip.svg?raw=true" width="300">
    </picture
</p>

This is a library that converts Japanese address input into English address

demo app: https://romajip-demo.vercel.app/

## Features

- **Accurate Conversion**: Transforms Japanese addresses into structured English components.
- **No Fetch Required**: The library includes its own dataset, eliminating the need for fetching data and keeping the library size minimal.
- **TypeScript Support**: Built with TypeScript for type safety and better developer experience.
- **No External Dependencies**: Includes all necessary data within the library, avoiding additional dependencies.

## Installation

Install romajip via npm or yarn:

```bash
npm install romajip
```

```bash
yarn add romajip
```

## Usage

Import the romajip function and use it to convert Japanese addresses to their English equivalents.

## Basic Example

```typescript
import { romajip } from "romajip"

const japaneseAddress = "東京都渋谷区神南1丁目23-1"

const parsed = romajip(japaneseAddress)

if (parsed) {
  console.log(parsed)
  /*
    Output:
    {
      japanese: [ '東京都', '渋谷区', '神南', '1丁目23-1' ],
      romaji: [ 'tokyo', 'shibuya-ku', 'jinnan', '1-chome23-1' ]
    }
  */
} else {
  console.log("Unable to parse the address.")
}
```
