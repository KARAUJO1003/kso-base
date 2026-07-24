# Adaptações do Script de Geração para este projeto

Este documento lista todas as adaptações feitas ao script de geração de módulos para funcionar corretamente com a estrutura do projeto este projeto.

## 📋 Mudanças Realizadas

### 1. **Estrutura de Pastas**

#### ❌ Projeto Original

```
src/
  features/
    modulo-nome/
  app/
    (root)/
      modulo-nome/
  types/
    modulo-nome/
```

#### ✅ este projeto

```
src/
  features/
    (cadastros)/          ← Nova: Categoria de features
      modulo-nome/
  app/
    (root)/
      (cadastros)/        ← Nova: Categoria de páginas
        modulo-nome/
  types/                  ← Precisa ser criada
    modulo-nome/
```

**Mudanças:**

- Adicionado suporte para subpastas de categoria em features: `(cadastros)`, `(sistema)`, etc.
- Adicionado suporte para subpastas de categoria em pages
- Pasta `src/types/` não existe e será criada automaticamente

---

### 2. **Importações e Componentes**

#### Hook de Modal

❌ **Original:** `@/hooks/use-modal`  
✅ **Projeto:** `@/hooks/use-modal-instance`

#### DataTable

❌ **Original:** `@/components/datatable/table`  
✅ **Projeto:** `@/components/data-table`

#### DataTableColumnHeader

❌ **Original:** `@/components/datatable/columns-header-cell`  
✅ **Projeto:** `@/components/extensions/datatable/datatable-header-column`

#### Highlight Component

❌ **Original:** `@/components/extensions/highlight`  
✅ **Projeto:** `@/components/extensions/search-highlight`

---

### 3. **Configurações**

#### Feature Flags

**Estrutura Original:**

```typescript
export const FEATURE_FLAGS = {
  modules: {
    permissoes: {
      criar: true,
      editar: true,
      // ...
    },
  },
};
```

**Estrutura Projeto:**

```typescript
export const FEATURE_FLAGS = {
  modules: {
    cadastros: {           ← Categoria
      permissoes: {
        criar: true,
        editar: true,
        visualizar: true,
        excluir: ambientMode() === "development",
      }
    },
    sistema: {
      // ...
    }
  }
}
```

**Mudanças:**

- Feature flags agora são aninhadas em categorias
- Adicionada flag `visualizar`
- Flag `excluir` usa função `ambientMode()`

---

#### Sidebar

**Original:** `site-config.ts` com estrutura `navMain.items[]`

**Projeto:**

- `sidebar-menu.config.ts` - Configuração do menu
- `site-config.ts` - Configuração geral do site
- Estrutura: `SIDEBAR_PAGES.navRegistrations[]`, `navMain[]`, `documents[]`

**Seções disponíveis:**

- `navMain` - Menu principal
- `navRegistrations` - Cadastros (padrão)
- `navSecondary` - Menu secundário
- `documents` - Documentos/Sistema

---

### 4. **Paths.js - Novas Funções**

#### getFeaturePath

```javascript
// Antes
getFeaturePath(featureName);

// Agora
getFeaturePath(featureName, featureCategory);
// Exemplo: getFeaturePath("unidades-medidas", "(cadastros)")
```

#### getPagePath

```javascript
// Antes
getPagePath(featureLocation, featureName);

// Agora
getPagePath(featureLocation, featureName, pageCategory);
// Exemplo: getPagePath("(root)", "unidades-medidas", "(cadastros)")
```

---

## 🚀 Como Usar o Script Atualizado

### Comando

```bash
node scripts/generate-module-new.mjs
```

### Perguntas Interativas

1. **Nome do módulo** (ex: `unidades-medidas`)
2. **Rota do CRUD** (ex: `/unidades-medidas`)
3. **Título da página** (ex: `Unidades de Medida`)
4. **Descrição da página**
5. **Nome da entidade singular** (ex: `UnidadeMedida`)
6. **Pasta dos types** (ex: `unidades-medidas`)
7. **Campo principal** (ex: `nome`)
8. **Label do campo** (ex: `Nome`)
9. **Caminho da feature** (`(root)` ou `(auth)`)
10. **Categoria da feature** ⭐ NOVO - ex: `(cadastros)`, deixe vazio para raiz
11. **Categoria da página** ⭐ NOVO - ex: `(cadastros)`, usa mesma da feature se vazio
12. **Nome base da permissão** (ex: `unidades-medidas`)

### Exemplo de Uso

```
1. Nome do módulo: unidades-medidas
2. Rota do CRUD: /unidades-medidas
3. Título da página: Unidades de Medida
4. Descrição da página: Gerenciamento de unidades de medida
5. Nome da entidade singular: UnidadeMedida
6. Pasta dos types: unidades-medidas
7. Campo principal: nome
8. Label do campo: Nome
9. Caminho da feature: (root)
10. Categoria da feature: (cadastros)
11. Categoria da página: (cadastros)
12. Nome base da permissão: unidades-medidas
```

**Resultado:**

```
src/
  features/
    (cadastros)/
      unidades-medidas/
        feature.tsx
        components/
        utils/
  app/
    (root)/
      (cadastros)/
        unidades-medidas/
          page.tsx
  types/
    unidades-medidas/
      types.ts
```

---

## 📦 Arquivos Gerados

O script gera automaticamente:

### Features

- `features/{categoria}/{modulo}/feature.tsx`
- `features/{categoria}/{modulo}/components/table.tsx`
- `features/{categoria}/{modulo}/components/table-columns.tsx`
- `features/{categoria}/{modulo}/components/form-{modulo}.tsx`
- `features/{categoria}/{modulo}/components/editar-{modulo}-modal.tsx`
- `features/{categoria}/{modulo}/components/excluir-{modulo}-modal.tsx`

### Utils

- `features/{categoria}/{modulo}/utils/constants.ts`
- `features/{categoria}/{modulo}/utils/module-utils.ts`

### Types

- `types/{pasta-types}/types.ts`

### Page

- `app/{location}/{categoria}/{modulo}/page.tsx`

### Atualizações Automáticas

- ✅ `lib/feature-flags/flags.config.ts` - Adiciona flag do módulo
- ✅ `config/sidebar-menu.config.ts` - Adiciona item no menu

---

## ⚠️ Notas Importantes

1. **Pasta types**: Será criada automaticamente se não existir
2. **Categorias**: Use sempre entre parênteses, ex: `(cadastros)`, `(sistema)`
3. **Sidebar**: Itens são adicionados na seção `navRegistrations` por padrão
4. **Feature Flags**: Módulos são adicionados em `modules.cadastros` por padrão
5. **Ícones**: O script usa `IconFileDescription` como ícone padrão (pode ser alterado manualmente depois)

---

## 🔧 Arquivos Modificados

### Core

- `scripts/core/constants/paths.js` - Funções de caminho atualizadas
- `scripts/core/config-ops/presets.js` - Atualizadores de config adaptados

### Templates

- `scripts/core/templates/react/table.js` - Imports corrigidos
- `scripts/core/templates/react/editar-modal.js` - Hook atualizado
- `scripts/core/templates/react/form-modal.js` - Hook atualizado
- `scripts/core/templates/react/table-columns.js` - Imports de componentes corrigidos

### Main

- `scripts/generate-module-new.mjs` - Novas perguntas e lógica de categorias

---

## 🐛 Troubleshooting

### Erro: "Categoria não encontrada"

- Verifique se a categoria existe em `flags.config.ts`
- Categorias válidas: `cadastros`, `sistema`

### Erro: "Seção não encontrada no sidebar"

- Verifique se a seção existe em `sidebar-menu.config.ts`
- Seções válidas: `navMain`, `navRegistrations`, `navSecondary`, `documents`

### Módulo gerado sem categoria

- Se você deixou as perguntas 10 e 11 vazias, o módulo será criado na raiz
- Para usar categorias, preencha explicitamente com `(cadastros)` ou outra categoria

---

## 📝 Changelog

### v1.0.0 - Adaptação este projeto

- ✅ Adicionado suporte para categorias de features
- ✅ Adicionado suporte para categorias de páginas
- ✅ Corrigidos imports de componentes
- ✅ Adaptadas funções de atualização de configs
- ✅ Documentação completa
