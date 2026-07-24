import { fakerPT_BR as faker } from "@faker-js/faker";

export function fakeId(): string {
  return faker.database.mongodbObjectId();
}

export function fakeTimestamps(daysBack = 240) {
  const createdAt = faker.date.recent({ days: daysBack }).toISOString();
  const updatedAt = faker.date
    .between({ from: createdAt, to: new Date() })
    .toISOString();
  return { createdAt, updatedAt };
}

export function sequentialCodigo(prefix: string, index: number, width = 4) {
  return `${prefix}${String(index + 1).padStart(width, "0")}`;
}

export function pickOne<T>(items: T[]): T {
  return faker.helpers.arrayElement(items);
}

export function pickSome<T>(items: T[], min = 1, max = 3): T[] {
  return faker.helpers.arrayElements(items, { min, max });
}

export function maybe<T>(value: T, probability = 0.7): T | undefined {
  return faker.datatype.boolean(probability) ? value : undefined;
}

export function times<T>(count: number, factory: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, index) => factory(index));
}

export { faker };
