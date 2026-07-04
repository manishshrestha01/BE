#!/usr/bin/env node
/* eslint-env node */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_DIR = path.resolve(__dirname, "..", "public");
const OUTPUT_FILE = path.join(PUBLIC_DIR, "aclib-anti-adblock.js");

const API_URL = "https://adbpage.com/adblock?v=3&format=js";

function fetch(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { timeout: 15000 }, (res) => {
        if (res.statusCode < 200 || res.statusCode >= 300) {
          reject(new Error(`HTTP ${res.statusCode} from ${url}`));
          return;
        }
        const chunks = [];
        res.on("data", (c) => chunks.push(c));
        res.on("end", () => resolve(Buffer.concat(chunks)));
      })
      .on("error", reject)
      .on("timeout", function () {
        this.destroy();
        reject(new Error("Request timed out"));
      });
  });
}

async function main() {
  console.log("Fetching Adcash anti-adblock library...");
  try {
    const data = await fetch(API_URL);
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, data, "utf8");
    console.log(`Saved anti-adblock library to ${OUTPUT_FILE} (${data.length} bytes)`);
  } catch (error) {
    console.error("Failed to fetch anti-adblock library:", error.message);
    console.log("Falling back: creating placeholder that loads CDN version instead.");
    const fallback = `(function(){var s=document.createElement("script");s.id="aclib";s.src="//acscdn.com/script/aclib.js";document.head.appendChild(s)})();\n`;
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, fallback, "utf8");
    console.log(`Fallback written to ${OUTPUT_FILE}`);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
