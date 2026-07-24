# Camadas de UI

Este projeto usa componentes no estilo shadcn/base-ui: eles não são uma
dependência instalada, são código copiado para dentro do repositório
(`components.json` na raiz configura os registries `@reui`, `@diceui`,
`@bklit`). Isso muda a forma de manter e customizar.

## As três camadas

1. **`src/components/ui/*` e `src/components/reui/*` — vendored.**
   Saída direta do CLI (`npx shadcn add ...`). **Nunca edite esses arquivos
   à mão.** Se precisar de um comportamento diferente, componha por cima
   (camada 2) ou rode o CLI de novo para atualizar.

2. **`src/components/ds/*` — composição própria.**
   Todo componente que combina primitivos do `ui/` com lógica ou visual
   específico do produto (ex: `field-array-table.tsx`, `brand-logo.tsx`)
   mora aqui. É o único lugar onde customização de comportamento deve
   acontecer.

3. **Tokens CSS (`src/themes/brand.css` e `globals.css`) — aparência.**
   Toda customização visual (cor, raio de borda, etc.) é feita trocando
   valores de variável CSS, nunca editando um `.tsx` de componente.
   `brand.css` é a única camada que deve mudar por cliente/projeto —
   `globals.css` referencia esses tokens por nome semântico e não deveria
   precisar de edição.

## Por que isso importa

Como os componentes são copiados, "atualizar" um componente shadcn/reui
significa rodar o CLI de novo por cima do arquivo existente — o que
sobrescreve qualquer edição manual feita nele. Mantendo `ui/`/`reui/`
intocados e toda customização em `ds/`, atualizações futuras (inclusive via
um registry privado, se um dia isso for criado) não geram conflito.

## Ao adicionar um componente novo

```bash
npx shadcn add <nome>
# ou de um registry configurado:
npx shadcn add @reui/<nome>
```

Se o componente precisar de uma variação de comportamento, crie um wrapper
em `src/components/ds/` que importa e compõe o componente de `ui/` —  não
edite o arquivo gerado.
