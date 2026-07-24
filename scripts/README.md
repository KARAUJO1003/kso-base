# Scripts

Scripts utilitários para geração de código e automação do projeto.

## ⚠️ Importante - Adaptado para este projeto

Este script foi adaptado de outro projeto para funcionar com a estrutura específica do este projeto.

**📖 [Veja todas as adaptações, mudanças e guia de uso completo](./ADAPTACOES.md)**

---

## 📜 Scripts Disponíveis

### generate-module-new.mjs ✨ NOVO (Refatorado)

Gerador completo de módulos CRUD com todas as funcionalidades.

**Uso:**

```bash
node scripts/generate-module-new.mjs
```

**O que gera:**

- ✅ Feature completa em `src/features/{module}/`
- ✅ Components (table, form, modals)
- ✅ Types e interfaces
- ✅ Utils (constants, module-utils)
- ✅ Page protegida com AuthGuard
- ✅ Atualização automática de feature flags
- ✅ Atualização automática do sidebar

**Benefícios da versão refatorada:**

- 📉 Reduzido de ~650 para ~130 linhas
- 🔧 Usa utilidades reutilizáveis de `core/`
- 🎨 Templates modulares e fáceis de manter
- 🧪 Mais fácil de testar e debugar

---

### generate-module.mjs (Original)

Versão original do gerador de módulos (preservada para compatibilidade).

**Uso:** Mesmo que a versão nova, mas com código legado.

---

### gerar-cidades.js

Script para buscar dados de cidades brasileiras do IBGE/GitHub e gerar constantes TypeScript.

**Uso:**

```bash
node scripts/gerar-cidades.js
```

---

## 🧰 Core Utilities

A pasta `core/` contém utilidades reutilizáveis para criar seus próprios scripts:

```
core/
├── string-utils/       # toPascal, toCamel, toKebab, toUpper
├── file-ops/           # createFile, batchCreateFiles
├── config-ops/         # updateFeatureFlags, updateSidebar
├── prompts/            # ask, closeInput (input handling)
├── constants/          # Paths do projeto
├── templates/          # Templates React e TypeScript
└── examples/           # Exemplos e templates
```

**📖 Documentação completa:** [core/README.md](./core/README.md)

## 🚀 Criar Seu Próprio Script

### Opção 1: Usar Template

```bash
cp scripts/core/examples/generator-template.mjs scripts/my-generator.mjs
# Edite my-generator.mjs conforme necessário
node scripts/my-generator.mjs
```

### Opção 2: Do Zero

```javascript
import { ask, closeInput } from "./core/prompts/input-handler.js";
import { toPascal } from "./core/string-utils/transformers.js";
import { createFile } from "./core/file-ops/file-writer.js";

const name = await ask("Nome: ");
createFile(`output.ts`, `export const ${toPascal(name)} = {};`);
closeInput();
```

## 📦 Utilidades Disponíveis

### Transformações de String

```javascript
import {
  toPascal,
  toCamel,
  toKebab,
  toUpper,
} from "./core/string-utils/transformers.js";

toPascal("user-profile"); // "UserProfile"
toCamel("UserProfile"); // "userProfile"
toKebab("UserProfile"); // "user-profile"
toUpper("user-profile"); // "USER_PROFILE"
```

### Input do Usuário

```javascript
import { ask, closeInput } from "./core/prompts/input-handler.js";

const name = await ask("Seu nome: ");
console.log(`Olá, ${name}!`);
closeInput();
```

### Operações de Arquivo

```javascript
import { createFile, batchCreateFiles } from "./core/file-ops/file-writer.js";

// Único arquivo
createFile("path/file.ts", "conteúdo");

// Múltiplos arquivos
batchCreateFiles([
  { dir: "src", name: "a.ts", content: "..." },
  { dir: "src", name: "b.ts", content: "..." },
]);
```

### Atualizar Configs

```javascript
import {
  updateFeatureFlags,
  updateSidebar,
} from "./core/config-ops/presets.js";

updateFeatureFlags("meu-modulo");
updateSidebar({ title: "Meu Módulo", url: "/meu-modulo" });
```

## 🧪 Testando Scripts

### Modo Interativo

```bash
node scripts/your-script.mjs
```

### Modo Automatizado (Piped)

```bash
echo -e "valor1\nvalor2\nvalor3" | node scripts/your-script.mjs
```

## 🏗️ Estrutura de Projeto

Scripts geradores criam arquivos seguindo esta estrutura:

```
src/
├── features/{module}/
│   ├── feature.tsx
│   ├── components/
│   │   ├── table.tsx
│   │   ├── table-columns.tsx
│   │   ├── form-{module}.tsx
│   │   ├── editar-{module}-modal.tsx
│   │   └── excluir-{module}-modal.tsx
│   └── utils/
│       ├── constants.ts
│       └── module-utils.ts
├── types/{module}/
│   └── types.ts
└── app/(root|auth)/{module}/
    └── page.tsx
```

## 📝 Exemplos de Uso

### Gerar Módulo Completo

```bash
node scripts/generate-module-new.mjs
# Responda às perguntas interativas
```

### Gerar com Inputs Pré-definidos

```bash
cat << EOF | node scripts/generate-module-new.mjs
produtos
/produtos
Produtos
Gerenciamento de produtos
Produto
produtos
nome
Nome
(root)
produtos
EOF
```

## 🔧 Migração do Script Original

O `generate-module-new.mjs` é funcionalmente idêntico ao original, mas:

- ✅ Mais legível e manutenível
- ✅ Reutiliza código através de `core/`
- ✅ Templates separados e editáveis
- ✅ Fácil de estender com novas funcionalidades
- ✅ Testável isoladamente

**Para migrar:**

```bash
# Teste a nova versão primeiro
node scripts/generate-module-new.mjs

# Se tudo funcionar, substitua o original
mv scripts/generate-module.mjs scripts/generate-module-old.mjs.bak
mv scripts/generate-module-new.mjs scripts/generate-module.mjs
```

## 🐛 Troubleshooting

### Script não encontra módulos

Certifique-se de executar do root do projeto:

```bash
cd fbi_front
node scripts/your-script.mjs
```

### Permissão negada

```bash
chmod +x scripts/your-script.mjs
```

### Input não funciona

Sempre chame `closeInput()` ao final:

```javascript
closeInput(); // ← Não esqueça!
```

## 📚 Documentação Adicional

- [Core Utilities](./core/README.md) - Documentação detalhada das utilidades
- [Generator Template](./core/examples/generator-template.mjs) - Template de exemplo

## 🤝 Contribuindo

Ao criar novos scripts:

1. Use as utilidades de `core/` sempre que possível
2. Documente no topo do arquivo (propósito e uso)
3. Adicione exemplos se for complexo
4. Atualize este README
