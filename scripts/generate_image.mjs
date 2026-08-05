#!/usr/bin/env node
// Generate high-quality, design-oriented images via OpenAI's Images API (gpt-image-1).
//
// Usage:
//   node scripts/generate_image.mjs "prompt text" [options]
//
// Options:
//   --out <path>       Output file path (default: ./generated/<timestamp>.png)
//   --size <WxH>        1024x1024 | 1024x1536 | 1536x1024 | auto (default: auto)
//   --quality <q>       low | medium | high | auto (default: high)
//   --background <b>    auto | transparent | opaque (default: auto)
//   --n <count>          number of images to generate (default: 1)
//
// Requires OPENAI_API_KEY in the environment (or a .env file in the project root).

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

try {
  process.loadEnvFile(new URL("../.env", import.meta.url));
} catch {
  // .env is optional; fall back to whatever is already in the environment.
}

function parseArgs(argv) {
  const args = { size: "auto", quality: "high", background: "auto", n: 1 };
  const positional = [];
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      args[key] = argv[++i];
    } else {
      positional.push(a);
    }
  }
  args.prompt = positional.join(" ");
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (!args.prompt) {
    console.error("Error: prompt is required.\nUsage: node scripts/generate_image.mjs \"prompt text\" [--size 1024x1024] [--quality high] [--out path.png]");
    process.exit(1);
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("Error: OPENAI_API_KEY is not set. Add it to your shell profile or a .env file in the project root.");
    process.exit(1);
  }

  const body = {
    model: "gpt-image-1",
    prompt: args.prompt,
    size: args.size,
    quality: args.quality,
    background: args.background,
    n: Number(args.n),
  };

  console.error(`Generating image via gpt-image-1 (size=${body.size}, quality=${body.quality})...`);

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`OpenAI API error (${res.status}): ${errText}`);
    process.exit(1);
  }

  const json = await res.json();
  const images = json.data ?? [];

  if (images.length === 0) {
    console.error("No image data returned.");
    process.exit(1);
  }

  const outBase = args.out ?? path.join("generated", `image-${Date.now()}.png`);
  const outDir = path.dirname(outBase);
  await mkdir(outDir, { recursive: true });

  const ext = path.extname(outBase) || ".png";
  const stem = ext ? outBase.slice(0, -ext.length) : outBase;

  const savedPaths = [];
  for (let i = 0; i < images.length; i++) {
    const b64 = images[i].b64_json;
    if (!b64) continue;
    const filePath = images.length > 1 ? `${stem}-${i + 1}${ext}` : outBase;
    await writeFile(filePath, Buffer.from(b64, "base64"));
    savedPaths.push(filePath);
  }

  for (const p of savedPaths) {
    console.log(path.resolve(p));
  }
}

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
