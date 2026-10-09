import fs from "node:fs";

const files = [
  "src/lib/seating-data.ts",
  "src/lib/lighting-data.ts",
  "src/lib/decor-data.ts",
  "src/lib/mirrors-data.ts",
];

for (const file of files) {
  let s = fs.readFileSync(file, "utf8");
  s = s.replace(/price: "\$([\d,]+)"/g, (_, n) => {
    const usd = Number.parseInt(n.replace(/,/g, ""), 10);
    return `priceUsd: ${usd}`;
  });
  s = s.replace(/price: string/g, "priceUsd: number");
  fs.writeFileSync(file, s);
}

console.log("Migrated", files.length, "files");
