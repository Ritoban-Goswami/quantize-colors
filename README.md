# quantize-colors

`quantize-colors` is a lightweight and flexible Node.js package designed to simplify color quantization for image processing. The package provides functions for converting and quantizing RGB colors, building color palettes, and generating complementary color sets.

## Features

- **Color Quantization:** Efficiently reduce the number of colors in an image while preserving visual fidelity.
- **Palette Building:** Generate color palettes based on luminance, creating visually appealing sets of colors.
- **Complementary Colors:** Calculate complementary colors for each palette entry, allowing for versatile color schemes.
- **HSL Conversion:** Convert RGB colors to HSL (Hue, Saturation, Lightness) representation and vice versa.

## Installation

Install `quantize-colors` using npm:

```bash
npm install quantize-colors
```

## Usage

```bash
const quantizeColors = require('quantize-colors');

// Example: Build a color palette from image data
const imageData = /* ... */; // Get your image data
const rgbArray = quantizeColors.buildRgb(imageData.data);
const quantizedPalette = quantizeColors.quantization(rgbArray, 0);

// Example: Build and display a palette
quantizeColors.buildPalette(quantizedPalette);

// Additional functions such as rgbToHex, hslToHex, orderByLuminance, and more are available for advanced color processing.
```

Visit the [GitHub repository](#) for detailed documentation and code examples.

## License

This package is distributed under the [MIT License](#).
