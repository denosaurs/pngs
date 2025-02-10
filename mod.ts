import { decode as wasmDecode, encode as wasmEncode } from "./lib/pngs.js";

type ValueOf<T> = T[keyof T];

/**
 * Color types
 */
export const ColorType = {
  /**
   * Each pixel is a grayscale sample.
   */
  Grayscale: 0,
  /**
   * Each pixel is an R,G,B triple.
   */
  RGB: 2,
  /**
   * Each pixel is a palette index; a PLTE chunk must appear.
   */
  Indexed: 3,
  /**
   * Each pixel is a grayscale sample, followed by an alpha sample.
   */
  GrayscaleAlpha: 4,
  /**
   * Each pixel is an R,G,B triple, followed by an alpha sample.
   */
  RGBA: 6,
};

/**
 * Bit depths
 */
export const BitDepth = {
  /**
   * Depth of 1 bit.
   */
  One: 1,
  /**
   * Depth of 2 bits.
   */
  Two: 2,
  /**
   * Depth of 4 bits.
   */
  Four: 4,
  /**
   * Depth of 8 bits.
   */
  Eight: 8,
  /**
   * Depth of 16 bits.
   */
  Sixteen: 16,
};

/**
 * Compression methods
 */
export const Compression = {
  /**
   * Default compression method.
   */
  Default: 0,
  /**
   * Fast compression method.
   */
  Fast: 1,
  /**
   * Best compression method.
   */
  Best: 2,
  /**
   * Huffman compression method.
   */
  Huffman: 3,
  /**
   * RLE compression method.
   */
  Rle: 4,
};

/**
 * Filter methods
 */
export const FilterType = {
  /**
   * No filter.
   */
  NoFilter: 0,
  /**
   * Sub filter.
   */
  Sub: 1,
  /**
   * Up filter.
   */
  Up: 2,
  /**
   * Average filter.
   */
  Avg: 3,
  /**
   * Paeth filter.
   */
  Paeth: 4,
};

/**
 * Result of decoding a PNG image
 */
export interface DecodeResult {
  /**
   * The decoded image data.
   */
  image: Uint8Array;
  /**
   * The width of the image.
   */
  width: number;
  /**
   * The height of the image.
   */
  height: number;
  /**
   * The color type of the image.
   */
  colorType: ValueOf<typeof ColorType>;
  /**
   * The bit depth of the image
   */
  bitDepth: ValueOf<typeof BitDepth>;
  /**
   * The size of a line in the image.
   */
  lineSize: number;
}

/**
 * Encodes an image to PNG format.
 *
 * @example
 * ```ts
 * // An array containing a RGBA sequence where the first pixel is red and second is black
 * const data = new Uint8Array([255, 0, 0, 255, 0, 0, 0, 255]);
 * // Encode the image to have width 2 and height 1 pixel
 * const png = encode(data, 2, 1);
 * await Deno.writeFile("image.png", png);
 * ```
 */
export function encode(
  /**
   * The image data to encode.
   */
  image: Uint8Array,
  /**
   * The width of the image.
   */
  width: number,
  /**
   * The height of the image.
   */
  height: number,
  /**
   * Options for encoding the image.
   */
  options?: {
    /**
     * The palette to use.
     */
    palette?: Uint8Array;
    /**
     * The transparency data.
     */
    trns?: Uint8Array;
    /**
     * The color type of the image.
     */
    color?: ValueOf<typeof ColorType>;
    /**
     * The bit depth of the image.
     */
    depth?: ValueOf<typeof BitDepth>;
    /**
     * The compression method to use.
     */
    compression?: ValueOf<typeof Compression>;
    /**
     * The filter method to use.
     */
    filter?: ValueOf<typeof FilterType>;
    /**
     * Whether to strip the alpha channel from the image.
     */
    stripAlpha?: boolean;
  },
): Uint8Array {
  if (options?.stripAlpha) {
    image = image.filter((_, i) => (i + 1) % 4);
  }

  return wasmEncode(
    image,
    width,
    height,
    options?.palette,
    options?.trns,
    options?.color ?? ColorType.RGBA,
    options?.depth ?? BitDepth.Eight,
    options?.compression,
    options?.filter,
  );
}

/**
 * Decodes a PNG image.
 *
 * @example
 * ```ts
 * const image = await Deno.readFile("image.png");
 * const res = decode(image);
 * console.log(res.width, res.height);
 * ```
 */
export function decode(image: Uint8Array): DecodeResult {
  const res = wasmDecode(image);

  return {
    image: new Uint8Array(res.image),
    width: res.width,
    height: res.height,
    colorType: res.colorType,
    bitDepth: res.bitDepth,
    lineSize: res.lineSize,
  };
}
