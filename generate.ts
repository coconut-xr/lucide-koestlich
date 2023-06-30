import { readdir, readFile, writeFile } from "fs/promises";
import { format } from "prettier";

const baseDir = "icons/";

async function main() {
  const icons = await readdir(baseDir);
  for (const icon of icons) {
    const name = getName(icon);
    const raw = await readFile(`${baseDir}${icon}`);
    const svg = raw.toString();
    const code = `
      /* eslint-disable no-shadow-restricted-names */
      import { SVGFromText } from "@coconut-xr/koestlich";
      import React, { ComponentPropsWithoutRef } from "react"; 
      export type ${name}Props = Omit<ComponentPropsWithoutRef<typeof SVGFromText>, "text">;
      export function ${name}(props: ${name}Props) {
        return <SVGFromText {...props} text={\`${svg}\`} />
      }
    `;
    writeFile(`src/${name}.tsx`, code);
  }
  writeFile(
    "src/index.tsx",
    icons.map((icon) => `export * from "./${getName(icon)}.js";`).join("\n"),
  );
}

function getName(file: string): string {
  const name = file.slice(0, -4);
  return name[0].toUpperCase() + name.slice(1).replace(/-./g, (x) => x[1].toUpperCase());
}

main();
