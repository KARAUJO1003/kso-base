# Checklist de Verificação - Pós Geração de Módulo

Use esta checklist após gerar um novo módulo para garantir que tudo está funcionando corretamente.

## ✅ Verificações Automáticas

### 1. Arquivos Criados

- [ ] `src/features/{categoria}/{modulo}/feature.tsx`
- [ ] `src/features/{categoria}/{modulo}/components/table.tsx`
- [ ] `src/features/{categoria}/{modulo}/components/table-columns.tsx`
- [ ] `src/features/{categoria}/{modulo}/components/form-{modulo}.tsx`
- [ ] `src/features/{categoria}/{modulo}/components/editar-{modulo}-modal.tsx`
- [ ] `src/features/{categoria}/{modulo}/components/excluir-{modulo}-modal.tsx`
- [ ] `src/features/{categoria}/{modulo}/utils/constants.ts`
- [ ] `src/features/{categoria}/{modulo}/utils/module-utils.ts`
- [ ] `src/types/{modulo}/types.ts`
- [ ] `src/app/{location}/{categoria}/{modulo}/page.tsx`

### 2. Configurações Atualizadas

- [ ] Feature flag adicionada em `lib/feature-flags/flags.config.ts`
- [ ] Item de menu adicionado em `config/sidebar-menu.config.ts`

---

## 🔍 Verificações Manuais

### 3. Imports (Abra cada arquivo e verifique)

#### `feature.tsx`

```typescript
import { PageContainer, PageHeader, ... } from "@/components/layout/page-container"; ✓
import { Table... } from "./components/table"; ✓
import { Form...Modal } from "./components/form-..."; ✓
```

#### `table.tsx`

```typescript
import { useModalInstance } from "@/hooks/use-modal-instance"; ✓
import { DataTable } from "@/components/data-table"; ✓
import { useFetch } from "@/hooks/use-crud"; ✓
import { AuthGuard } from "@/lib/auth/components/auth-guard"; ✓
```

#### `table-columns.tsx`

```typescript
import { DataTableColumnHeader } from "@/components/extensions/datatable/datatable-header-column"; ✓
import { Highlight } from "@/components/extensions/search-highlight"; ✓
```

#### `form-{modulo}.tsx`

```typescript
import { useModalInstance } from "@/hooks/use-modal-instance"; ✓
import { useCreate, useUpdate } from "@/hooks/use-crud"; ✓
```

#### `editar-{modulo}-modal.tsx`

```typescript
import { useModalInstance } from "@/hooks/use-modal-instance"; ✓
```

### 4. Compilação

```bash
# Execute no terminal
npm run build
# ou
yarn build
```

- [ ] Sem erros de TypeScript
- [ ] Sem erros de imports não encontrados

### 5. Feature Flags

Abra `lib/feature-flags/flags.config.ts`:

```typescript
export const FEATURE_FLAGS = {
  modules: {
    {categoria}: {
      {seuModulo}: {      ← Deve estar aqui
        criar: true,
        editar: true,
        visualizar: true,
        excluir: ambientMode() === "development",
      }
    }
  }
}
```

- [ ] Módulo adicionado na categoria correta
- [ ] Estrutura mantida corretamente
- [ ] Sem erros de sintaxe

### 6. Sidebar

Abra `config/sidebar-menu.config.ts`:

```typescript
export const SIDEBAR_PAGES = {
  navRegistrations: [    ← Ou outra seção
    // ... items existentes
    {
      title: "Seu Módulo",
      icon: IconFileDescription,
      disabled: false,
      url: "/seu-modulo",
      new: true,           ← Se marcou como novo
    },
  ]
}
```

- [ ] Item adicionado na seção correta
- [ ] URL corresponde à rota do módulo
- [ ] Sintaxe correta (vírgulas, etc)

### 7. Types

Abra `types/{modulo}/types.ts`:

```typescript
export interface I{NomeDaEntidade} {
  _id: string;
  {campoPrincipal}: string;
  createdAt: string;
  updatedAt: string;
}
```

- [ ] Interface nomeada corretamente
- [ ] Campo principal está presente
- [ ] Campos padrão (\_id, dates) incluídos

---

## 🧪 Testes Funcionais

### 8. Acesso à Página

- [ ] Inicie o servidor dev: `npm run dev`
- [ ] Acesse `http://localhost:3000/{rota-do-modulo}`
- [ ] Página carrega sem erro 404
- [ ] Layout do PageContainer renderiza

### 9. Menu Sidebar

- [ ] Item aparece no sidebar
- [ ] Ao clicar, navega para a página correta
- [ ] Ícone está visível (padrão ou personalizado)

### 10. Funcionalidades CRUD (após conectar backend)

- [ ] Botão "Adicionar" abre modal
- [ ] Modal de criação renderiza
- [ ] Formulário tem validação
- [ ] Tabela renderiza (vazia ou com dados)
- [ ] Botões de editar/excluir aparecem nas linhas
- [ ] Modal de edição carrega dados
- [ ] Modal de exclusão funciona

---

## 🎨 Personalizações Recomendadas

### 11. Após Verificação Básica

#### Ícone do Sidebar

```typescript
// Em sidebar-menu.config.ts
import { IconSeuIcone } from "@tabler/icons-react";

{
  title: "Seu Módulo",
  icon: IconSeuIcone,     ← Mude para ícone apropriado
  // ...
}
```

#### Campos Adicionais no Type

```typescript
// Em types/{modulo}/types.ts
export interface I{Entidade} {
  _id: string;
  {campoPrincipal}: string;
  // Adicione seus campos específicos
  email?: string;
  telefone?: string;
  ativo: boolean;
  createdAt: string;
  updatedAt: string;
}
```

#### Colunas da Tabela

```typescript
// Em components/table-columns.tsx
// Adicione novas colunas personalizadas
export const columns = (): ColumnDef<IEntidade, any>[] => [
  nomeColumn(),
  emailColumn(),          ← Adicione suas colunas
  telefoneColumn(),
  createdAtColumn(),
  updatedAtColumn(),
  actionsColumn(),
];
```

#### Campos do Formulário

```typescript
// Em components/form-{modulo}.tsx
const formSchema = z.object({
  {campoPrincipal}: z.string().min(2, "..."),
  // Adicione validações para novos campos
  email: z.string().email("Email inválido"),
  telefone: z.string().optional(),
});
```

---

## 🐛 Solução de Problemas

### Erro: Cannot find module '@/...'

- [ ] Verifique se o caminho existe
- [ ] Compare com imports de módulos existentes
- [ ] Verifique `tsconfig.json` paths

### Erro: Module not found

- [ ] Execute `npm install` ou `yarn`
- [ ] Limpe cache: `rm -rf .next`
- [ ] Reinicie o servidor dev

### Erro: Type errors

- [ ] Execute `npm run type-check`
- [ ] Verifique interfaces e types
- [ ] Compare com módulos funcionando

### Feature flag não funciona

- [ ] Verifique sintaxe do objeto
- [ ] Confirme que está na categoria correta
- [ ] Reinicie o servidor

### Sidebar não atualiza

- [ ] Verifique vírgulas e sintaxe JSON
- [ ] Hard refresh do navegador (Ctrl+Shift+R)
- [ ] Reinicie o servidor dev

---

## 📋 Checklist Final

Antes de fazer commit:

- [ ] ✅ Todos os arquivos gerados corretamente
- [ ] ✅ Configurações atualizadas
- [ ] ✅ Sem erros de compilação
- [ ] ✅ Imports corretos
- [ ] ✅ Página acessível
- [ ] ✅ Menu funciona
- [ ] ✅ Personalizações básicas feitas
- [ ] ✅ Testado localmente

---

## 📝 Próximos Passos

1. **Backend:** Criar rotas e controladores no backend
2. **Validações:** Adicionar regras de negócio específicas
3. **Campos:** Expandir formulário com campos necessários
4. **Permissões:** Configurar permissões reais no sistema
5. **Testes:** Criar testes unitários e E2E
6. **Documentação:** Documentar regras de negócio do módulo

---

## 🎯 Dica Pro

Crie um módulo de teste primeiro:

```bash
node scripts/generate-module-new.mjs

Nome: teste-geracao
Categoria: (cadastros)
# ... complete as outras perguntas

# Verifique tudo
# Se estiver OK, delete e crie seu módulo real
```

Isso evita erros no módulo definitivo!
