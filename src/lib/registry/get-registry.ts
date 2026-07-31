import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface RegistryFile {
  path: string;
  type: string;
  target: string;
}

export interface RegistryItem {
  name: string;
  type: string;
  title: string;
  description: string;
  files?: RegistryFile[];
  registryDependencies?: string[];
  dependencies?: string[];
  categories?: string[];
}

interface RegistryJson {
  name: string;
  homepage: string;
  items: RegistryItem[];
}

let cached: RegistryJson | null = null;

function loadRegistry(): RegistryJson {
  if (!cached) {
    const raw = readFileSync(join(process.cwd(), "registry.json"), "utf8");
    cached = JSON.parse(raw) as RegistryJson;
  }
  return cached;
}

export function getRegistryItems(): RegistryItem[] {
  return loadRegistry().items;
}

export function getRegistryItem(name: string): RegistryItem | undefined {
  return getRegistryItems().find((item) => item.name === name);
}

/** Itens com preview próprio: blocks reais, exclui os guarda-chuva (sem files). */
export function getBlockItems(): RegistryItem[] {
  return getRegistryItems().filter(
    (item) => item.type === "registry:block" && (item.files?.length ?? 0) > 0,
  );
}
