import { readFileSync } from "fs";
import { resolve } from "path";

export function loadEnv() {
  const text = readFileSync(resolve(process.cwd(), ".env"), "utf8");

  for (const line of text.split(/\r?\n/)) {
    if (!line || line.startsWith("#")) {
      continue;
    }

    const index = line.indexOf("=");
    if (index < 0) {
      continue;
    }

    const key = line.slice(0, index).trim();
    const value = line.slice(index + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}
