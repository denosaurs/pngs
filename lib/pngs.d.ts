// @generated file from wasmbuild -- do not edit
// deno-lint-ignore-file
// deno-fmt-ignore-file

export function encode(
  image: Uint8Array,
  width: number,
  height: number,
  palette?: Uint8Array | null,
  trns?: Uint8Array | null,
  color?: number | null,
  depth?: number | null,
  compression?: number | null,
  filter?: number | null,
): Uint8Array;
export function decode(image: Uint8Array): any;
export class DecodeResult {
  private constructor();
  free(): void;
}
