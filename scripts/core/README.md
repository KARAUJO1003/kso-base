# Scripts Core - Utilidades Reutilizáveis

Biblioteca modular de utilidades para criação de scripts geradores de código.

## 📁 Estrutura

```
core/
├── string-utils/       # Transformações de string
├── file-ops/           # Operações de arquivo
├── config-ops/         # Atualização de configs
├── prompts/            # Input handling interativo
├── constants/          # Paths e constantes
├── templates/          # Templates de código
│   ├── react/         # Components React
│   └── typescript/    # Types e configs TS
└── examples/          # Exemplos e templates
```

## 🚀 Início Rápido

### Criar um Novo Script Generator

```javascript
import { ask, closeInput } from "./core/prompts/input-handler.js";
import { toPascal, toKebab } from "./core/string-utils/transformers.js";
import { createFile } from "./core/file-ops/file-writer.js";

const name = await ask("Nome: ");
const pascal = toPascal(name);

createFile(`output/${toKebab(name)}.tsx`, `export function ${pascal}() {}`);
closeInput();
```

Veja [examples/generator-template.mjs](./examples/generator-template.mjs) para um exemplo completo.

## 📦 Módulos

### string-utils/transformers.js

Transformações de case para nomes:

```javascript
import { toPascal, toCamel, toKebab, toUpper } from "./core/string-utils/transformers.js";

toPascal("user-profile")  // "UserProfile"
toCamel("UserProfile")    // "userProfile"
toKebab("UserProfile")    // "user-profile"
toUpper("user-profile")   // "USER_PROFILE"
```

### prompts/input-handler.js

Input handling com suporte a TTY e piped input:

```javascript
import { ask, closeInput, isInteractive } from "./core/prompts/input-handler.js";

const name = await ask("What's your name? ");
console.log(`Hello, ${name}!`);
closeInput(); // Sempre feche ao final
```

**Modo piped:**
```bash
echo "John\n30" | node script.mjs
```

### file-ops/file-writer.js

Operações de arquivo:

```javascript
import { createFile, batchCreateFiles, fileExists } from "./core/file-ops/file-writer.js";

// Criar arquivo único
createFile("path/file.ts", "content");

// Criar múltiplos arquivos
batchCreateFiles([
  { dir: "src", name: "index.ts", content: "..." },
  { dir: "src", name: "types.ts", content: "..." },
]);

// Verificar existência
if (fileExists("path/file.ts")) { /* ... */ }
```

### constants/paths.js

Caminhos do projeto:

```javascript
import { 
  SRC_DIR, 
  FEATURES_DIR, 
  getFeaturePath,
  getPagePath 
} from "./core/constants/paths.js";

const featurePath = getFeaturePath("usuarios"); 
// → src/features/usuarios

const pagePath = getPagePath("(root)", "usuarios");
// → src/app/(root)/usuarios
```

### config-ops/presets.js

Atualização de configurações comuns:

```javascript
import { updateFeatureFlags, updateSidebar } from "./core/config-ops/presets.js";

// Adicionar feature flag
updateFeatureFlags("usuarios");

// Adicionar item ao sidebar
updateSidebar({
  title: "Usuários",
  url: "/usuarios",
  section: "Cadastros",
  markAsNew: true,
});
```

### config-ops/config-updater.js

Atualização genérica de configs (avançado):

```javascript
import { updateConfigFile, simpleReplace } from "./core/config-ops/config-updater.js";

// Replace simples
simpleReplace("config.ts", /oldValue/g, "newValue");

// Update complexo com regex patterns
updateConfigFile({
  filePath: "config.ts",
  sectionPattern: /export const CONFIG = \{[\s\S]*?\}/m,
  insertPattern: /(\{[\s\S]*?)(\n\})/m,
  newContent: "\n  newKey: 'value',",
  duplicateCheckPattern: /newKey:/,
  sectionName: "CONFIG",
});
```

## 🎨 Templates

Templates são funções que retornam strings de código:

```javascript
import { pageProtectedTemplate } from "./core/templates/react/page-protected.js";

const code = pageProtectedTemplate({
  PASCAL: "Usuario",
  KEBAB: "usuarios",
});
```

### Templates Disponíveis

**React:**
- `page-protected.js` - Page com AuthGuard
- `feature.js` - Feature principal
- `table.js` - DataTable component
- `table-columns.js` - Column definitions
- `form-modal.js` - Create/Edit form
- `editar-modal.js` - Edit button
- `excluir-modal.js` - Delete button

**TypeScript:**
- `types.js` - Interface definitions
- `constants.js` - Modal/Query/Mutation keys
- `module-utils.js` - Route, Permissions, Config

## 🛠️ Convenções

### Nomenclatura de Variáveis

Padrão usado em todos os templates:

```javascript
const PASCAL = toPascal(name);      // "UserProfile"
const CAMEL = toCamel(name);        // "userProfile"
const KEBAB = toKebab(name);        // "user-profile"
const UPPER = toUpper(name);        // "USER_PROFILE"
const INTERFACE = `I${PASCAL}`;     // "IUserProfile"
```

### Estrutura de Arquivos Gerados

```
src/
├── features/{kebab}/
│   ├── feature.tsx
│   ├── components/
│   │   ├── table.tsx
│   │   ├── table-columns.tsx
│   │   ├── form-{kebab}.tsx
│   │   ├── editar-{kebab}-modal.tsx
│   │   └── excluir-{kebab}-modal.tsx
│   └── utils/
│       ├── constants.ts
│       └── module-utils.ts
├── types/{kebab}/
│   └── types.ts
└── app/(root)/{kebab}/
    └── page.tsx
```

## 📝 Exemplos de Uso

### 1. Script Simples

Criar um componente React:

```javascript
import { ask, closeInput } from "./core/prompts/input-handler.js";
import { toPascal, toKebab } from "./core/string-utils/transformers.js";
import { createFile } from "./core/file-ops/file-writer.js";

const name = await ask("Component name: ");
const pascal = toPascal(name);
const kebab = toKebab(name);

createFile(
  `src/components/${kebab}.tsx`,
  `export function ${pascal}() { return <div>${pascal}</div>; }`
);

closeInput();
```

### 2. Script com Templates

Usar templates existentes:

```javascript
import { featureTemplate } from "./core/templates/react/feature.js";
import { createFile } from "./core/file-ops/file-writer.js";

const code = featureTemplate({
  PASCAL: "Dashboard",
  KEBAB: "dashboard",
  pageTitle: "Dashboard",
  pageDescription: "Visão geral do sistema",
});

createFile("src/features/dashboard/feature.tsx", code);
```

### 3. Script Completo

Ver [generate-module-new.mjs](../generate-module-new.mjs) para exemplo completo.

## 🧪 Testando Scripts

### Modo Interativo
```bash
node scripts/your-script.mjs
```

### Modo Piped (Automated)
```bash
echo -e "module-name\n/route\nTitle" | node scripts/your-script.mjs
```

## 📚 Boas Práticas

1. **Sempre feche o input:** Chame `closeInput()` ao final do script
2. **Use constantes de paths:** Prefira `FEATURES_DIR` ao invés de hardcoded paths
3. **Valide inputs:** Cheque se valores obrigatórios foram fornecidos
4. **Forneça defaults:** Use `|| defaultValue` para valores opcionais
5. **Log informativo:** Mostre ao usuário o que está sendo criado
6. **Evite duplicatas:** Use `fileExists()` antes de criar arquivos

## 🔄 Atualizando Templates

Para modificar um template:

1. Edite o arquivo em `core/templates/`
2. Todos os scripts que usam esse template serão atualizados automaticamente
3. Não é necessário alterar cada script individualmente

## 📖 Mais Informações

- Ver [generate-module-new.mjs](../generate-module-new.mjs) - Gerador completo de módulos
- Ver [examples/generator-template.mjs](./examples/generator-template.mjs) - Template básico

## 🤝 Contribuindo

Ao adicionar novas utilidades:

1. Mantenha funções pequenas e focadas
2. Documente com JSDoc
3. Adicione exemplos de uso
4. Atualize este README
