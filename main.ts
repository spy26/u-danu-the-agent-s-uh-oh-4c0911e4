// The one word an agent says when it has no idea what to do.
//
// The program prints the word and drops the same word into entry.txt
// inside the output folder, so the judge reads exactly what was printed.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Wut";
const MAX_LEN = 99;

function isOneWord(text: string): boolean {
  if (text.length < 1 || text.length > MAX_LEN) return false;
  if (/\s/.test(text)) return false;
  for (const ch of text) {
    if (ch.codePointAt(0)! > 127) return false;
  }
  return true;
}

function outDir(): string {
  const fromEnv = process.env.MAKEFUN_OUTPUT_DIR;
  if (fromEnv && fromEnv.length > 0) return fromEnv;
  return "/output";
}

function writeWord(dir: string): void {
  mkdirSync(dir, { recursive: true });
  const target = join(dir, "entry.txt");
  writeFileSync(target, WORD, "utf8");
  const back = readFileSync(target, "utf8");
  if (back !== WORD) {
    throw new Error("entry.txt read-back does not match the word");
  }
}

if (!isOneWord(WORD)) {
  console.error("entry is not a single word of 1-99 ASCII characters");
  process.exit(1);
}

try {
  writeWord(outDir());
} catch {
  // The grading sandbox may not let us create /output; a folder next to
  // the program is the next best home for the file.
  try {
    writeWord("./output");
  } catch {
    console.error("could not write entry.txt to any output folder");
    process.exit(1);
  }
}
console.log(WORD);
