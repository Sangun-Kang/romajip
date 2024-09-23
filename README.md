<p align="center">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://github.com/Sangun-Kang/romajip/blob/main/img/romajip.svg?raw=true">
      <img alt="romajip" src="https://github.com/Sangun-Kang/romajip/blob/main/img/romajip.svg?raw=true" width="300">
    </picture
</p>

This is a library that converts Japanese text input into English letters

## Features

- **Accurate Conversion**: Transforms Japanese addresses into structured English components.
- **Lightweight**: Optimized data handling keeps the library size minimal.
- **TypeScript Support**: Built with TypeScript for type safety and better developer experience.
- **No External Dependencies**: Includes all necessary data within the library, avoiding additional dependencies.
- **Functional Programming Paradigm**: Utilizes modern ES6 features and functional programming for clean and maintainable code.

## Installation

Install romajip via npm or yarn:

```bash
npm install romajip
```

```bash
yarn add romajip
```

## Usage

Import the convertAddress function and use it to convert Japanese addresses to their English equivalents.

## Basic Example

```typescript
import { convertAddress } from "romajip"

const japaneseAddress = "北海道札幌市中央区北一条西3丁目1-1"

const parsed = convertAddress(japaneseAddress)

if (parsed) {
  console.log(parsed)
  /*
    Output:
    {
      pref: '北海道',
      city: '札幌市中央区',
      ward: '北一条西',
      other: '3丁目1-1',
      pref_roma: 'Hokkaido',
      city_roma: 'Sapporo-shi Chuo-ku',
      ward_roma: 'Kita1joNishi',
      other_roma: '3-1-1',
    }
  */
} else {
  console.log("Unable to parse the address.")
}
```
