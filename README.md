# quantize-colors

`quantize-colors` is a lightweight and flexible package designed to simplify color quantization for image processing. The package provides functions for quantizing RGB colors, getting dominant color and building color palettes. It works in both Node.js and browser environments, with support for modern browsers, Web Workers, and OffscreenCanvas for worker environments.

## Features

- **Color Quantization:** Efficiently reduce the number of colors in an image while preserving visual fidelity.
- **Dominant Color:** Get the dominant color of the provided image.
- **Palette Building:** Generate color palettes based on luminance, creating visually appealing sets of colors.

## Installation

Install `quantize-colors` using npm:

```bash
npm install quantize-colors
```

## Usage

### ES Modules (Recommended)

```js
import {
  getQuantizedColors,
  getColorPalette,
  getDominantColor,
} from "quantize-colors";

// Example: Get the quantized colors of an image
const imageUrl = "https://example.com/image.jpg";
getQuantizedColors(imageUrl)
  .then((quantizedColors) => {
    console.log(quantizedColors);
  })
  .catch((err) => {
    console.error(err);
  });

// Example: Get the color palette of an image
getColorPalette(imageUrl)
  .then((colorPalette) => {
    console.log(colorPalette);
  })
  .catch((err) => {
    console.error(err);
  });

// Example: Get the dominant color of an image
getDominantColor(imageUrl)
  .then((dominantColor) => {
    console.log(dominantColor);
  })
  .catch((err) => {
    console.error(err);
  });
```

### CommonJS

```js
const {
  getQuantizedColors,
  getColorPalette,
  getDominantColor,
} = require("quantize-colors");

// Usage is the same as ES modules
```

## Supported Input Types

All functions accept multiple input types for flexibility:

### Node.js Environment

- **String URL**: Remote or local file paths only

### Browser Environment

- **String URL**: Remote or data URLs
- **HTMLImageElement**: Pre-loaded image elements
- **HTMLCanvasElement**: Canvas elements with drawn content
- **ImageBitmap**: ImageBitmap objects
- **Blob/File**: File objects from file inputs

### Examples with Different Input Types

```js
import { getDominantColor } from "quantize-colors";

// Works in both Node.js and browser
const colorFromUrl = await getDominantColor("https://example.com/image.jpg");

// Browser-only examples
const img = document.querySelector("img");
const colorFromImg = await getDominantColor(img);

const canvas = document.querySelector("canvas");
const colorFromCanvas = await getDominantColor(canvas);

const fileInput = document.querySelector("input[type='file']");
const file = fileInput.files[0];
const colorFromFile = await getDominantColor(file);

const bitmap = await createImageBitmap(img);
const colorFromBitmap = await getDominantColor(bitmap);
```

Visit the [GitHub repository](https://github.com/Ritoban-Goswami/quantize-colors) for detailed documentation and code examples.

## License

This package is distributed under the ISC License.
