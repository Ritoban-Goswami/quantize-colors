// const buildPalette = (colorsList) => {
//     const paletteContainer = document.getElementById("palette");
//     const complementaryContainer = document.getElementById("complementary");

//     paletteContainer.innerHTML = "";
//     complementaryContainer.innerHTML = "";

//     const orderedByColor = orderByLuminance(colorsList);
//     const hslColors = orderedByColor.map(convertRGBtoHSL);

//     for (let i = 0; i < orderedByColor.length; i++) {
//         const hexColor = rgbToHex(orderedByColor[i]);
//         const hexColorComplementary = hslToHex(hslColors[i]);

//         if (i > 0 && calculateColorDifference(orderedByColor[i], orderedByColor[i - 1]) < 120) {
//             continue;
//         }

//         const colorElement = createColorElement(hexColor);
//         paletteContainer.appendChild(colorElement);

//         if (hslColors[i].h) {
//             const complementaryElement = createColorElement(hexColorComplementary, hslColors[i]);
//             complementaryContainer.appendChild(complementaryElement);
//         }
//     }
// };

// const createColorElement = (color, hslColor) => {
//     const colorElement = document.createElement("div");
//     colorElement.style.backgroundColor = color;
//     colorElement.appendChild(document.createTextNode(color));

//     if (hslColor) {
//         const complementaryElement = document.createElement("div");
//         complementaryElement.style.backgroundColor = `hsl(${hslColor.h},${hslColor.s}%,${hslColor.l}%)`;
//         complementaryElement.appendChild(document.createTextNode(color));
//         return complementaryElement;
//     }

//     return colorElement;
// };

// const convertRGBtoHSL = (pixel) => {
//     const red = pixel.r / 255;
//     const green = pixel.g / 255;
//     const blue = pixel.b / 255;

//     const Cmax = Math.max(red, green, blue);
//     const Cmin = Math.min(red, green, blue);
//     const difference = Cmax - Cmin;

//     let luminance = (Cmax + Cmin) / 2.0;
//     let saturation = 0;

//     if (luminance > 0.5) {
//         saturation = difference / (2.0 - Cmax - Cmin);
//     } else {
//         saturation = difference / (Cmax + Cmin);
//     }

//     let hue;
//     if (difference !== 0) {
//         if (Cmax === red) {
//             hue = ((green - blue) / difference + (green < blue ? 6 : 0)) * 60;
//         } else if (Cmax === green) {
//             hue = ((blue - red) / difference + 2) * 60;
//         } else {
//             hue = ((red - green) / difference + 4) * 60;
//         }

//         hue = (hue + 180) % 360; // plus 180 degrees for complementary color
//     }

//     return { h: Math.round(hue), s: parseFloat(saturation * 100).toFixed(2), l: parseFloat(luminance * 100).toFixed(2) };
// };

// const hslToHex = (hslColor) => {
//     const { h, s, l } = hslColor;
//     const hslColorCopy = { h, s, l: l / 100 };

//     const calculateColor = (n) => {
//         const k = (n + hslColorCopy.h / 30) % 12;
//         const color = hslColorCopy.l - (hslColorCopy.s * Math.min(Math.min(k - 3, 9 - k, 1), -1) / 100);
//         return Math.round(255 * color).toString(16).padStart(2, "0");
//     };

//     return `#${calculateColor(0)}${calculateColor(8)}${calculateColor(4)}`.toUpperCase();
// };

const getPixels = require('get-pixels');

const calculateColorDifference = (color1, color2) => {
    const rDifference = Math.pow(color2.r - color1.r, 2);
    const gDifference = Math.pow(color2.g - color1.g, 2);
    const bDifference = Math.pow(color2.b - color1.b, 2);
    return rDifference + gDifference + bDifference;
};

const rgbToHex = (pixel) => {
    const componentToHex = (c) => c.toString(16).padStart(2, "0");
    return `#${componentToHex(pixel.r)}${componentToHex(pixel.g)}${componentToHex(pixel.b)}`.toUpperCase();
};

const calculateLuminance = (p) => 0.2126 * p.r + 0.7152 * p.g + 0.0722 * p.b;
const orderByLuminance = (rgbValues) => {
    return rgbValues.sort((p1, p2) => calculateLuminance(p2) - calculateLuminance(p1));
};

const findBiggestColorRange = (rgbValues) => {
    const findMinMax = (channel, minMax) => rgbValues.reduce((acc, pixel) => Math[minMax](acc, pixel[channel]), Number[minMax === 'min' ? 'MAX_VALUE' : 'MIN_VALUE']);
    const rRange = findMinMax('r', 'max') - findMinMax('r', 'min');
    const gRange = findMinMax('g', 'max') - findMinMax('g', 'min');
    const bRange = findMinMax('b', 'max') - findMinMax('b', 'min');

    return (rRange >= gRange && rRange >= bRange) ? 'r' : (gRange >= rRange && gRange >= bRange) ? 'g' : 'b';
};

const quantization = (rgbValues, depth) => {
    const MAX_DEPTH = 4;

    if (depth === MAX_DEPTH || rgbValues.length === 0) {
        const color = rgbValues.reduce((prev, curr) => ({ r: prev.r + curr.r, g: prev.g + curr.g, b: prev.b + curr.b }), { r: 0, g: 0, b: 0 });
        color.r = Math.round(color.r / rgbValues.length);
        color.g = Math.round(color.g / rgbValues.length);
        color.b = Math.round(color.b / rgbValues.length);
        return [color];
    }

    const componentToSortBy = findBiggestColorRange(rgbValues);
    rgbValues.sort((p1, p2) => p1[componentToSortBy] - p2[componentToSortBy]);

    const mid = Math.floor(rgbValues.length / 2);
    return [...quantization(rgbValues.slice(0, mid), depth + 1), ...quantization(rgbValues.slice(mid + 1), depth + 1)];
};

const buildRgb = (imageData) => {
    const rgbValues = [];
    for (let i = 0; i < imageData.length; i += 4) {
        rgbValues.push({ r: imageData[i], g: imageData[i + 1], b: imageData[i + 2] });
    }
    return rgbValues;
};

const isMonochromeColor = (color) => {
    // Check if the color is monochrome (black, white, or shades of grey)
    return color.r === color.g && color.g === color.b;
};

const calculateSaturation = (color) => {
    // Calculate saturation in HSL color space
    const max = Math.max(color.r, color.g, color.b) / 255;
    const min = Math.min(color.r, color.g, color.b) / 255;
    const lightness = (max + min) / 2;

    if (max === min) {
        return 0; // achromatic (grayscale)
    } else {
        const delta = max - min;
        const saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
        return saturation;
    }
};

const getQuantizedColors = (imageUrl) => {
    return new Promise((resolve, reject) => {
        getPixels(imageUrl, function (err, pixels) {
            if (err) {
                reject(err);
                return;
            } else {
                const rgbArray = buildRgb(pixels.data);
                const quantColors = quantization(rgbArray, 0);
                resolve(quantColors);
            }
        });
    });
};

const getColorPalette = (imageUrl, colorDifferenceThreshold = 120) => {
    return getQuantizedColors(imageUrl)
        .then((quantColors) => {
            const orderedByColor = orderByLuminance(quantColors);
            const hexColorPalette = [];

            for (let i = 0; i < orderedByColor.length; i++) {
                const hexColor = rgbToHex(orderedByColor[i]);

                // Exclude monochrome colors (black, white, and shades of grey)
                const isMonochrome = isMonochromeColor(orderedByColor[i]);
                if (isMonochrome) {
                    continue;
                }

                // Check color difference with the previous color
                if (i > 0 && calculateColorDifference(orderedByColor[i], orderedByColor[i - 1]) < colorDifferenceThreshold) {
                    continue;
                }

                hexColorPalette.push(hexColor);
            }
            return hexColorPalette;
        })
        .catch((err) => {
            throw err; // or handle the error as needed
        });
}

const getDominantColor = (imageUrl, colorDifferenceThreshold = 120) => {
    return getColorPalette(imageUrl, colorDifferenceThreshold)
        .then((colorPalette) => {
            if (colorPalette.length === 0) {
                throw new Error('No non-monochrome colors found in the palette.');
            }

            // Find the most dominant color based on saturation
            const mostDominantColor = colorPalette.reduce((prevColor, currentColor) => {
                const prevSaturation = calculateSaturation(prevColor);
                const currentSaturation = calculateSaturation(currentColor);

                return currentSaturation > prevSaturation ? currentColor : prevColor;
            });

            return mostDominantColor;
        })
        .catch((err) => {
            throw err; // or handle the error as needed
        });
};


module.exports = {
    getQuantizedColors,
    getColorPalette,
    getDominantColor
};