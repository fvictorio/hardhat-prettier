# hardhat-prettier

Use [Prettier Solidity](https://github.com/prettier-solidity/prettier-plugin-solidity/) to format your code.

## What

This plugin lets you automatically format your code using Prettier Solidity and check that it's correctly formatted.

## Installation

<_A step-by-step guide on how to install the plugin_>

```bash
npm install hardhat-prettier prettier prettier-plugin-solidity
```

Import the plugin in your `hardhat.config.js`:

```js
require("hardhat-prettier");
```

Or if you are using TypeScript, in your `hardhat.config.ts`:

```ts
import "hardhat-prettier";
```

## Tasks

This plugin adds the `format` task, that will format and overwrite your Solidity code.

It also overrides the `check` task, to add checking your code's format as part of the `check` pipeline.

## Configuration

This plugin will use prettier's defaults, but you can configure it by creating a `.prettierrc` file:

```json
{
  "plugins": ["prettier-plugin-solidity"],
  "singleQuote": true
}
```
