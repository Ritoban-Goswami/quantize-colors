# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-05-14

### Added
- Browser environment support alongside Node.js
- Support for multiple input types in browser: HTMLImageElement, HTMLCanvasElement, ImageBitmap, Blob, File
- OffscreenCanvas support for Web Workers
- Enhanced TypeScript definitions with JSDoc documentation
- LICENSE file with ISC license
- CHANGELOG.md for tracking version history

### Changed
- Refactored codebase for better maintainability:
  - Extracted magic numbers to constants (CANVAS_SIZE, MAX_DEPTH, thresholds)
  - Created helper functions: createCanvas, getCanvasContext, processImageSource, processCanvasElement
  - Improved error messages with specific details
  - Added input validation
- Updated package.json to reflect dual environment support
- Fixed misleading comment in buildRgb function
- Updated README with environment-specific usage examples

### Fixed
- Canvas creation now properly falls back from OffscreenCanvas to regular canvas
- Better error handling for unsupported input types

## [1.0.2] - Previous Release

### Note
- Previous version history not documented in this changelog
