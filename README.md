# quantize-colors

`quantize-colors` is a lightweight and flexible Node.js package designed to simplify color quantization for image processing. The package provides functions for quantizing RGB colors, getting dominant color and building color palettes.

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

```bash
const quantizeColors = require('quantize-colors');

// Example: Get the quantized colors of an image
const imageUrl = 'path/to/your/image.jpg';
quantizeColors.getQuantizedColors(imageUrl)
    .then((quantizedColors) => {
        console.log(quantizedColors);
    })
    .catch((err) => {
        console.error(err);
    });

// Example: Get the color palette of an image
quantizeColors.getColorPalette(imageUrl)
    .then((colorPalette) => {
        console.log(colorPalette);
    })
    .catch((err) => {
        console.error(err);
    });

// Example: Get the dominant color of an image
quantizeColors.getDominantColor(imageUrl)
    .then((dominantColor) => {
        console.log(dominantColor);
    })
    .catch((err) => {
        console.error(err);
    });
```

Visit the [GitHub repository](https://github.com/Ritoban-Goswami/quantize-colors) for detailed documentation and code examples.

## License

This package is distributed under the ISC License.
