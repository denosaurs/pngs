import { requires, run } from "./_util.ts";

export async function lint() {
  await requires("cargo", "deno");
  await run(
    "linting typescript",
    [
      "deno",
      "lint",
      "scripts",
      "test_deps.ts",
      "test.ts",
      "mod.ts",
    ],
    true,
  );

  await run("linting rust", ["cargo", "clippy", "-q"], true);
}

if (import.meta.main) {
  await lint();
}
