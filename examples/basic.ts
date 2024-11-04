import { decode } from "../mod.ts";

const file = await (await fetch(
    "https://avatars.githubusercontent.com/u/65427464?s=49&v=4",
)).bytes();
console.log(decode(file));
