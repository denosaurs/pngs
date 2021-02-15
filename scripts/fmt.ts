import { requires, run } from "./_util.ts";

export async function fmt() {
  await requires("cargo", "deno");
  await run(
    "formatting typescript",
    [
      "deno",
      "--unstable",
      "fmt",
      "scripts/",
      "test_deps.ts",
      "test.ts",
      "mod.ts",
    ],
    true,
  );

  await run("formatting rust", ["cargo", "fmt", "-q"], true);
}

if (import.meta.main) {
  await fmt();
}
