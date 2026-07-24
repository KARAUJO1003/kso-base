# Exemplos de Uso - Gerador de Módulos este projeto

## 📝 Exemplo 1: Módulo de Cadastro Simples

### Contexto

Criar um módulo para gerenciar "Tipos de Produto".

### Comando

```bash
node scripts/generate-module-new.mjs
```

### Respostas

```
1. Nome do módulo: tipos-produto
2. Rota do CRUD: /tipos-produto
3. Título da página: Tipos de Produto
4. Descrição da página: Gerenciamento de tipos de produto
5. Nome da entidade singular: TipoProduto
6. Pasta dos types: tipos-produto
7. Campo principal: nome
8. Label do campo: Nome
9. Caminho da feature: (root)
10. Categoria da feature: (cadastros)
11. Categoria da página: (cadastros)
12. Nome base da permissão: tipos-produto
```

### Resultado

```
✨ Módulo "Tipos de Produto" criado com sucesso!
📦 10 arquivos criados
📍 Feature: src/features/(cadastros)/tipos-produto
📍 Page: src/app/(root)/(cadastros)/tipos-produto
📍 Types: src/types/tipos-produto
```

### Estrutura Gerada

```
src/
  features/
    (cadastros)/
      tipos-produto/
        feature.tsx
        components/
          table.tsx
          table-columns.tsx
          form-tipos-produto.tsx
          editar-tipos-produto-modal.tsx
          excluir-tipos-produto-modal.tsx
        utils/
          constants.ts
          module-utils.ts
  app/
    (root)/
      (cadastros)/
        tipos-produto/
          page.tsx
  types/
    tipos-produto/
      types.ts
```

---

## 📝 Exemplo 2: Módulo sem Categoria

### Contexto

Criar um módulo na raiz, sem categorias.

### Respostas

```
1. Nome do módulo: dashboard
2. Rota do CRUD: /dashboard
3. Título da página: Dashboard
4. Descrição da página: Painel de controle
5. Nome da entidade singular: Dashboard
6. Pasta dos types: dashboard
7. Campo principal: title
8. Label do campo: Título
9. Caminho da feature: (root)
10. Categoria da feature: [deixar vazio - Enter]
11. Categoria da página: [deixar vazio - Enter]
12. Nome base da permissão: dashboard
```

### Resultado

```
src/
  features/
    dashboard/              ← Sem categoria
      feature.tsx
  app/
    (root)/
      dashboard/            ← Sem categoria
        page.tsx
```

---

## 📝 Exemplo 3: Módulo de Autenticação

### Contexto

Criar um módulo protegido em área de autenticação.

### Respostas

```
1. Nome do módulo: perfil
2. Rota do CRUD: /perfil
3. Título da página: Meu Perfil
4. Descrição da página: Gerenciamento do perfil do usuário
5. Nome da entidade singular: Perfil
6. Pasta dos types: perfil
7. Campo principal: nome
8. Label do campo: Nome
9. Caminho da feature: (auth)        ← Área de autenticação
10. Categoria da feature: [Enter]
11. Categoria da página: [Enter]
12. Nome base da permissão: perfil
```

### Resultado

```
src/
  features/
    perfil/
  app/
    (auth)/                ← Área protegida
      perfil/
```

---

## 📝 Exemplo 4: Módulo do Sistema

### Contexto

Criar um módulo de sistema (não cadastro).

### Respostas

```
1. Nome do módulo: configuracoes
2. Rota do CRUD: /configuracoes
3. Título da página: Configurações
4. Descrição da página: Configurações do sistema
5. Nome da entidade singular: Configuracao
6. Pasta dos types: configuracoes
7. Campo principal: chave
8. Label do campo: Chave
9. Caminho da feature: (root)
10. Categoria da feature: (sistema)
11. Categoria da página: (sistema)
12. Nome base da permissão: configuracoes
```

### Feature Flag Gerada

```typescript
// lib/feature-flags/flags.config.ts
export const FEATURE_FLAGS = {
  modules: {
    sistema: {                    ← Categoria diferente
      configuracoes: {
        criar: true,
        editar: true,
        visualizar: true,
        excluir: ambientMode() === "development",
      }
    }
  }
}
```

---

## 📝 Exemplo 5: Campos Personalizados

### Contexto

Criar módulo com campo principal diferente de "nome".

### Respostas

```
1. Nome do módulo: eventos
2. Rota do CRUD: /eventos
3. Título da página: Eventos
4. Descrição da página: Gerenciamento de eventos
5. Nome da entidade singular: Evento
6. Pasta dos types: eventos
7. Campo principal: titulo         ← Campo diferente
8. Label do campo: Título do Evento
9. Caminho da feature: (root)
10. Categoria da feature: (cadastros)
11. Categoria da página: (cadastros)
12. Nome base da permissão: eventos
```

### Types Gerado

```typescript
// types/eventos/types.ts
export interface IEvento {
  _id: string;
  titulo: string;           ← Campo personalizado
  createdAt: string;
  updatedAt: string;
}
```

---

## 🎯 Casos de Uso Comuns

### Cadastros Gerais

```
Categoria: (cadastros)
Location: (root)
Exemplos: clientes, produtos, fornecedores, categorias
```

### Sistema/Admin

```
Categoria: (sistema)
Location: (root)
Exemplos: configuracoes, logs, auditoria
```

### Área Autenticada

```
Categoria: vazio ou específica
Location: (auth)
Exemplos: perfil, meus-dados, minhas-preferencias
```

### Módulos Raiz

```
Categoria: vazio
Location: (root)
Exemplos: dashboard, relatorios, analytics
```

---

## 🔧 Dicas e Boas Práticas

### Nomenclatura

- **Módulo:** Use kebab-case: `unidades-medidas`, `tipos-produto`
- **Entidade:** Use PascalCase: `UnidadeMedida`, `TipoProduto`
- **Rota:** Sempre com `/` inicial: `/unidades-medidas`

### Categorias

- Use parênteses: `(cadastros)`, `(sistema)`
- Se deixar vazio, vai para raiz
- Categoria da página usa mesma da feature se vazio

### Campos

- **Campo principal:** Geralmente `nome`, `titulo`, `descricao`
- **Label:** Versão humanizada: `Nome`, `Título`, `Descrição`

### Permissões

- Use o mesmo nome do módulo: `unidades-medidas`
- Será usado para validar: `criar`, `editar`, `excluir`, `visualizar`

---

## ⚠️ Problemas Comuns

### Erro: "Categoria não encontrada"

```bash
⚠️  Categoria "cadastro" não encontrada em FEATURE_FLAGS.modules
```

**Solução:** Use `(cadastros)` com "s" no final, ou verifique as categorias existentes em `flags.config.ts`

### Erro: "Seção não encontrada"

```bash
⚠️  Seção "Cadastros" não encontrada no sidebar config
```

**Solução:** Use `navRegistrations` ao invés de `Cadastros`

### Módulo gerado no lugar errado

**Problema:** Digitou categoria sem parênteses

**Correto:** `(cadastros)`  
**Incorreto:** `cadastros`

### Imports não encontrados após gerar

**Problema:** Pasta `types/` não foi criada

**Solução:** Execute o script novamente, ele cria automaticamente

---

## 📚 Referências

- [Adaptações Completas](./ADAPTACOES.md)
- [Resumo das Mudanças](./ADAPTATION_SUMMARY.md)
- [README Principal](./README.md)
