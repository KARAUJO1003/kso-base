// Converte chaves para string
type Key = string | number;

// Junta "a" + "b" => "a.b"
type Join<A extends Key, B extends Key> = `${A}.${B}`;

// Pega todos os caminhos "a.b.c" existentes no objeto
export type DotPath<T> = T extends object
  ? {
      [K in keyof T & Key]: T[K] extends object
        ? K | Join<K, DotPath<T[K]>>
        : K;
    }[keyof T & Key]
  : never;

// Dado um caminho "a.b.c", pega o tipo do valor naquele caminho
export type PathValue<
  T,
  P extends string,
> = P extends `${infer K}.${infer Rest}`
  ? K extends keyof T
    ? PathValue<T[K], Rest>
    : never
  : P extends keyof T
    ? T[P]
    : never;

// Filtra apenas caminhos cujo valor final é boolean
export type BooleanDotPath<T> = {
  [P in DotPath<T> & string]: PathValue<T, P> extends boolean ? P : never;
}[DotPath<T> & string];
