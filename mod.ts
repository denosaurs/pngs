import init, { encode as wasmEncode, source } from "./wasm.js";

await init(source);

type ValueOf<T> = T[keyof T];

export const ColorType = {
  Grayscale: 0,
  RGB: 2,
  Indexed: 3,
  GrayscaleAlpha: 4,
  RGBA: 6,
};

export const BitDepth = {
  One: 1,
  Two: 2,
  Four: 4,
  Eight: 8,
  Sixteen: 16,
};

export const Compression = {
  Default: 0,
  Fast: 1,
  Best: 2,
  Huffman: 3,
  Rle: 4,
};

export const FilterType = {
  NoFilter: 0,
  Sub: 1,
  Up: 2,
  Avg: 3,
  Paeth: 4,
};

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
  },
): Uint8Array {
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
