import { requires, run } from "./_util.ts";
import { compress, encode, minify } from "./_deps.ts";

const name = "pngs";
const target = "wasm.js";
const encoder = new TextEncoder();

export async function build() {
  await requires("cargo", "wasm-pack");

  if (!(await Deno.stat("Cargo.toml")).isFile) {
    console.log(`the build script should be executed in the "${name}" root`);
    Deno.exit(1);
  }

  await run(
    "building rust",
    ["wasm-pack", "build", "--target", "web", "--release"],
    true,
  );

  const wasm = await Deno.readFile(`pkg/${name}_bg.wasm`);
  console.log(`read wasm                      (size: ${wasm.length} bytes)`);
  const compressed = compress(wasm);
  console.log(
    `compressed wasm using lz4      (reduction: ${wasm.length -
      compressed.length} bytes, size: ${compressed.length} bytes)`,
  );
  const encoded = encode(compressed);
  console.log(
    `encoded wasm using base64      (increase: ${encoded.length -
      compressed.length} bytes, size: ${encoded.length} bytes)`,
  );

  const init = await Deno.readTextFile(`pkg/${name}.js`);
  console.log(`read js                        (size: ${init.length} bytes)`);

  const source = `import * as lz4 from "https://deno.land/x/lz4@v0.1.2/mod.ts";
                export const source = lz4.decompress(Uint8Array.from(atob("${encoded}"), c => c.charCodeAt(0)));
                ${init}`;
  console.log(`inlined js and wasm            (size: ${source.length} bytes)`);

  const output = await minify(source, {
    mangle: { module: true },
    output: {
      preamble: `// deno-lint-ignore-file\n// deno-fmt-ignore-file`,
    },
  });

  const reduction = new Blob([source]).size -
    new Blob([output.code]).size;
  console.log(
    `minified js                    (size reduction: ${reduction} bytes, size: ${output.code.length} bytes)`,
  );

  console.log(`writing output to file         (${target})`);
  await Deno.writeFile(target, encoder.encode(output.code));

  const outputFile = await Deno.stat(target);
  console.log(
    `final size is: ${outputFile.size} bytes`,
  );
}

if (import.meta.main) {
  await build();
}
