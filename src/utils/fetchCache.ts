import fs from "fs";
import path from "path";
import type { Options, Artwork, Artist } from "../../scripts/cache.js";

export default function fetchCache() {
  return JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "cache", "output.json"), "utf8")
  ) as {
    artwork: Artwork[];
    options: Options;
    artists: Artist[];
  };
}
