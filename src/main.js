// Constants
const CANVAS_SIZE = 100;
const MAX_DEPTH = 4;
const DEFAULT_COLOR_DIFFERENCE_THRESHOLD = 80;
const DEFAULT_DOMINANT_THRESHOLD = 120;
const FALLBACK_COLOR = "#808080";

// Detect if we're in a browser environment
const isBrowser = typeof window !== "undefined" || typeof self !== "undefined";

// Import get-pixels for Node.js environments (lazy loaded)
let getPixelsNode;
if (!isBrowser) {
  try {
    getPixelsNode = (await import("get-pixels")).default;
  } catch (e) {
    console.warn("get-pixels not available in this environment");
  }
}

// Helper function to create canvas with fallback support
const createCanvas = () => {
  if (typeof OffscreenCanvas !== "undefined") {
    return new OffscreenCanvas(CANVAS_SIZE, CANVAS_SIZE);
  } else if (typeof document !== "undefined" && document.createElement) {
    const canvas = document.createElement("canvas");
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;
    return canvas;
  }
  return null;
};

// Helper function to get 2D context from canvas
const getCanvasContext = (canvas) => {
  if (!canvas) return null;
  const ctx = canvas.getContext("2d");
  return ctx;
};

// Helper function to process image source to image data
const processImageSource = (source, resolve, reject) => {
  const canvas = createCanvas();
  if (!canvas) {
    reject(new Error("Canvas API not available in this environment"));
    return;
  }

  const ctx = getCanvasContext(canvas);
  if (!ctx) {
    reject(new Error("Failed to get 2D context from canvas"));
    return;
  }

  ctx.drawImage(source, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const imageData = ctx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  resolve(imageData);
};

// Helper function to process canvas element to image data
const processCanvasElement = (canvas, resolve, reject) => {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    reject(new Error("Failed to get 2D context from source canvas"));
    return;
  }

  const tempCanvas = createCanvas();
  if (!tempCanvas) {
    reject(new Error("Canvas API not available in this environment"));
    return;
  }

  const tempCtx = getCanvasContext(tempCanvas);
  if (!tempCtx) {
    reject(new Error("Failed to get 2D context from canvas"));
    return;
  }

  tempCtx.drawImage(canvas, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
  const imageData = tempCtx.getImageData(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  resolve(imageData);
};

// Browser-compatible image loading using Canvas API
// Node.js-compatible image loading using get-pixels
const getPixels = (imageInput) => {
  return new Promise((resolve, reject) => {
    // Validate input
    if (!imageInput) {
      reject(new Error("Image input is required"));
      return;
    }

    // Node.js environment - use get-pixels
    if (!isBrowser) {
      if (!getPixelsNode) {
        reject(
          new Error(
            "get-pixels is required for Node.js environments but could not be loaded",
          ),
        );
        return;
      }

      // In Node.js, only string URLs are supported
      if (typeof imageInput !== "string") {
        reject(
          new Error(
            `Unsupported input type '${typeof imageInput}'. In Node.js, only string URLs are supported as image input.`,
          ),
        );
        return;
      }

      getPixelsNode(imageInput, (err, pixels) => {
        if (err) {
          reject(new Error(`Failed to load image: ${err.message}`));
          return;
        }
        resolve(pixels);
      });
      return;
    }

    // Browser environment - use Canvas API
    // Handle different input types
    if (typeof imageInput === "string") {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => processImageSource(img, resolve, reject);
      img.onerror = (err) =>
        reject(new Error(`Failed to load image from URL: ${imageInput}`));
      img.src = imageInput;
    } else if (imageInput instanceof HTMLImageElement) {
      processImageSource(imageInput, resolve, reject);
    } else if (imageInput instanceof HTMLCanvasElement) {
      processCanvasElement(imageInput, resolve, reject);
    } else if (imageInput instanceof ImageBitmap) {
      processImageSource(imageInput, resolve, reject);
    } else if (imageInput instanceof Blob || imageInput instanceof File) {
      const url = URL.createObjectURL(imageInput);
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        URL.revokeObjectURL(url);
        processImageSource(img, resolve, reject);
      };
      img.onerror = (err) => {
        URL.revokeObjectURL(url);
        reject(new Error("Failed to load image from Blob/File"));
      };
      img.src = url;
    } else {
      reject(
        new Error(
          `Unsupported image input type: ${imageInput.constructor.name}. Supported types: string, HTMLImageElement, HTMLCanvasElement, ImageBitmap, Blob, File`,
        ),
      );
    }
  });
};

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
  return rgbValues.sort(
    (p1, p2) => calculateLuminance(p2) - calculateLuminance(p1),
  );
};

const findBiggestColorRange = (rgbValues) => {
  const findMinMax = (channel, minMax) =>
    rgbValues.reduce(
      (acc, pixel) => Math[minMax](acc, pixel[channel]),
      Number[minMax === "min" ? "MAX_VALUE" : "MIN_VALUE"],
    );
  const rRange = findMinMax("r", "max") - findMinMax("r", "min");
  const gRange = findMinMax("g", "max") - findMinMax("g", "min");
  const bRange = findMinMax("b", "max") - findMinMax("b", "min");

  return rRange >= gRange && rRange >= bRange
    ? "r"
    : gRange >= rRange && gRange >= bRange
      ? "g"
      : "b";
};

const quantization = (rgbValues, depth) => {
  if (depth === MAX_DEPTH || rgbValues.length === 0) {
    const color = rgbValues.reduce(
      (prev, curr) => ({
        r: prev.r + curr.r,
        g: prev.g + curr.g,
        b: prev.b + curr.b,
      }),
      { r: 0, g: 0, b: 0 },
    );
    color.r = Math.round(color.r / rgbValues.length);
    color.g = Math.round(color.g / rgbValues.length);
    color.b = Math.round(color.b / rgbValues.length);
    return [color];
  }

  const componentToSortBy = findBiggestColorRange(rgbValues);
  rgbValues.sort((p1, p2) => p1[componentToSortBy] - p2[componentToSortBy]);

  const mid = Math.floor(rgbValues.length / 2);
  return [
    ...quantization(rgbValues.slice(0, mid), depth + 1),
    ...quantization(rgbValues.slice(mid + 1), depth + 1),
  ];
};

const buildRgb = (imageData) => {
  const rgbValues = [];
  // Convert RGBA array to RGB objects (iterate by 4 since each pixel has R, G, B, A values)
  for (let i = 0; i < imageData.length; i += 4) {
    rgbValues.push({
      r: imageData[i],
      g: imageData[i + 1],
      b: imageData[i + 2],
    });
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
    const saturation =
      lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min);
    return saturation;
  }
};

const getQuantizedColors = (imageUrl) => {
  return getPixels(imageUrl).then((pixels) => {
    const rgbArray = buildRgb(pixels.data);
    const quantColors = quantization(rgbArray, 0);
    return quantColors;
  });
};

const getColorPalette = (
  imageUrl,
  colorDifferenceThreshold = DEFAULT_COLOR_DIFFERENCE_THRESHOLD,
) => {
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
        if (
          i > 0 &&
          calculateColorDifference(orderedByColor[i], orderedByColor[i - 1]) <
            colorDifferenceThreshold
        ) {
          continue;
        }

        hexColorPalette.push(hexColor);
      }
      return hexColorPalette;
    })
    .catch((err) => {
      throw err;
    });
};

const getDominantColor = (
  imageUrl,
  colorDifferenceThreshold = DEFAULT_DOMINANT_THRESHOLD,
) => {
  return getColorPalette(imageUrl, colorDifferenceThreshold)
    .then((colorPalette) => {
      if (colorPalette.length === 0) {
        return FALLBACK_COLOR;
      }

      // Find the most dominant color based on saturation
      const mostDominantColor = colorPalette.reduce(
        (prevColor, currentColor) => {
          const prevSaturation = calculateSaturation(prevColor);
          const currentSaturation = calculateSaturation(currentColor);

          return currentSaturation > prevSaturation ? currentColor : prevColor;
        },
      );

      return mostDominantColor;
    })
    .catch((err) => {
      return FALLBACK_COLOR;
    });
};

export { getQuantizedColors, getColorPalette, getDominantColor };
