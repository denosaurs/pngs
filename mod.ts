import init, {
  decode as wasmDecode,
  encode as wasmEncode,
  source,
} from "./wasm.js";

await init(source);

type ValueOf<T> = T[keyof T];

/**
 * Color type of the image.
 */
export const ColorType = {
  /**
   * Each pixel is a grayscale sample.
   */
  Grayscale: 0,

  /**
   * Each pixel is an R, G, B triple.
   */
  RGB: 2,

  /**
   * Each pixel is a palette index.
   */
  Indexed: 3,

  /**
   * Each pixel is a grayscale sample, followed by an alpha sample.
   */
  GrayscaleAlpha: 4,

  /**
   * Each pixel is an R, G, B triple, followed by an alpha sample.
   */
  RGBA: 6,
};

/**
 * Bit depth of the image.
 */
export const BitDepth = {
  One: 1,
  Two: 2,
  Four: 4,
  Eight: 8,
  Sixteen: 16,
};

/**
 * Compression method of the image.
 */
export const Compression = {
  /**
   * The default compression method.
   */
  Default: 0,

  /**
   * The fastest compression method.
   */
  Fast: 1,

  /**
   * The best compression method.
   */
  Best: 2,

  /**
   * The Huffman compression method
   */
  Huffman: 3,

  /**
   * The RLE compression method
   */
  Rle: 4,
};

/**
 * Filter method of the image.
 */
export const FilterType = {
  /**
   * No filter
   */
  NoFilter: 0,

  /**
   * The Sub filter
   */
  Sub: 1,

  /**
   * The Up filter
   */
  Up: 2,

  /**
   * The Average filter
   */
  Avg: 3,

  /**
   * The Paeth filter
   */
  Paeth: 4,
};

/**
 * Result of the decoding operation.
 */
export interface DecodeResult {
  /**
   * The decoded image.
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
   * The bit depth of the image.
   */
  bitDepth: ValueOf<typeof BitDepth>;

  /**
   * The size of a line in the image.
   */
  lineSize: number;
}
/**
 * Encodes the image with the specified options.
 *
 * ```ts
 * const image = Deno.readFileSync("image.png");
 * const encoded = encode(image, 100, 100, {
 *  color: ColorType.RGBA,
 *  depth: BitDepth.Eight,
 *  compression: Compression.Default,
 * });
 * ```
 */
export function encode(
  image: Uint8Array,
  width: number,
  height: number,
  options?: {
    palette?: Uint8Array;
    trns?: Uint8Array;
    color?: ValueOf<typeof ColorType>;
    depth?: ValueOf<typeof BitDepth>;
    compression?: ValueOf<typeof Compression>;
    filter?: ValueOf<typeof FilterType>;
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
 * Decodes the image.
 *
 * ```ts
 * const image = Deno.readFileSync("image.png");
 * const decoded = decode(image);
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
