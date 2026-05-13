/**
 * Represents an RGB color with red, green, and blue components (0-255)
 */
export interface RGBColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Supported input types for image processing in browser environments
 * In Node.js environments, only string URLs are supported
 */
export type BrowserImageInput =
  | string
  | HTMLImageElement
  | HTMLCanvasElement
  | ImageBitmap
  | Blob
  | File;

/**
 * Supported input types for image processing
 * - In Node.js: Only string URLs
 * - In Browser: string, HTMLImageElement, HTMLCanvasElement, ImageBitmap, Blob, or File
 */
export type ImageInput = string | BrowserImageInput;

/**
 * Error thrown when image processing fails
 */
export interface ImageProcessingError extends Error {
  name: "ImageProcessingError";
  message: string;
}

/**
 * Quantizes colors from an image using median cut algorithm
 * @param imageInput - The image to process. In Node.js: URL string only. In browser: URL string, HTMLImageElement, HTMLCanvasElement, ImageBitmap, Blob, or File
 * @returns Promise resolving to an array of quantized RGB colors
 * @throws {ImageProcessingError} When image loading or processing fails
 *
 * @example
 * ```ts
 * import { getQuantizedColors } from 'quantize-colors';
 *
 * // Works in both Node.js and browser
 * const colors = await getQuantizedColors('https://example.com/image.jpg');
 * console.log(colors); // [{ r: 255, g: 128, b: 0 }, ...]
 *
 * // Browser-only examples
 * const img = document.querySelector('img');
 * const colorsFromImg = await getQuantizedColors(img);
 * ```
 */
export declare function getQuantizedColors(
  imageInput: ImageInput,
): Promise<RGBColor[]>;

/**
 * Extracts a color palette from an image, excluding monochrome colors
 * @param imageInput - The image to process. In Node.js: URL string only. In browser: URL string, HTMLImageElement, HTMLCanvasElement, ImageBitmap, Blob, or File
 * @param colorDifferenceThreshold - Minimum color difference between palette colors (default: 80). Lower values = more colors, higher values = fewer colors
 * @returns Promise resolving to an array of hex color strings
 * @throws {ImageProcessingError} When image loading or processing fails
 *
 * @example
 * ```ts
 * import { getColorPalette } from 'quantize-colors';
 *
 * // Works in both Node.js and browser
 * const palette = await getColorPalette('https://example.com/image.jpg', 100);
 * console.log(palette); // ['#FF8000', '#00FF00', ...]
 *
 * // Browser-only example
 * const fileInput = document.querySelector('input[type="file"]');
 * const paletteFromFile = await getColorPalette(fileInput.files[0]);
 * ```
 */
export declare function getColorPalette(
  imageInput: ImageInput,
  colorDifferenceThreshold?: number,
): Promise<string[]>;

/**
 * Gets the dominant (most saturated) color from an image
 * @param imageInput - The image to process. In Node.js: URL string only. In browser: URL string, HTMLImageElement, HTMLCanvasElement, ImageBitmap, Blob, or File
 * @param colorDifferenceThreshold - Minimum color difference between palette colors (default: 120)
 * @returns Promise resolving to the dominant color as a hex string, or "#808080" (gray) as fallback
 *
 * @example
 * ```ts
 * import { getDominantColor } from 'quantize-colors';
 *
 * // Works in both Node.js and browser
 * const dominant = await getDominantColor('https://example.com/image.jpg');
 * console.log(dominant); // '#FF8000'
 *
 * // Browser-only example
 * const canvas = document.querySelector('canvas');
 * const dominantFromCanvas = await getDominantColor(canvas);
 * ```
 */
export declare function getDominantColor(
  imageInput: ImageInput,
  colorDifferenceThreshold?: number,
): Promise<string>;
