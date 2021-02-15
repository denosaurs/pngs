# pngs

[![Tags](https://img.shields.io/github/release/denosaurs/pngs)](https://github.com/denosaurs/pngs/releases)
[![CI Status](https://img.shields.io/github/workflow/status/denosaurs/pngs/check)](https://github.com/denosaurs/pngs/actions)
[![Dependencies](https://img.shields.io/github/workflow/status/denosaurs/pngs/depsbot?label=dependencies)](https://github.com/denosaurs/depsbot)
[![License](https://img.shields.io/github/license/denosaurs/pngs)](https://github.com/denosaurs/pngs/blob/master/LICENSE)

A simple wasm png encoder/decoder module for deno using wasm.

## Examples

### Decoding

```ts
import { decode } from "https://deno.land/x/pngs/mod.ts";

const file = await Deno.readFile("image.png");
console.log(decode(file));
```

### Encoding

```ts
import { encode } from "https://deno.land/x/pngs/mod.ts";

// An array containing a RGBA sequence where the first pixel is red and second is black
const data = new Uint8Array([255, 0, 0, 255, 0, 0, 0, 255]);
// Encode the image to have width 2 and height 1 pixel
const png = encode(data, 2, 1);

await Deno.writeFile("image.png", png);
```

## Maintainers

- Elias Sjögreen ([@eliassjogreen](https://github.com/eliassjogreen))

## Other

### Related

- [image-png](https://github.com/image-rs/image-png) - PNG decoding and encoding
  library in pure Rust

### Contribution

Pull request, issues and feedback are very welcome. Code style is formatted with
`deno fmt` and commit messages are done following
[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) spec.

### Licence

Copyright 2021, Denosaurs. All rights reserved. MIT license.
