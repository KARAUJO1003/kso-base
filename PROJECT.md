# PROJECT.md

> Este arquivo descreve o que é este projeto. Ele deve ser atualizado em cada
> projeto derivado do template (nome do cliente, módulos ligados/desligados,
> integrações específicas), mas a estrutura das seções abaixo deve ser
> mantida para qualquer IA ou dev conseguir se orientar rapidamente.

## O que é

`kso-base` é um template Next.js (App Router) para sistemas administrativos
internos: autenticação, controle de usuários/papéis/permissões, e um conjunto
de módulos de cadastro genéricos (organização + inventário/financeiro) que
aparecem em praticamente qualquer ERP interno. Não contém nenhuma regra de
negócio específica de um domínio (hotelaria, varejo, saúde, etc.) — isso é
adicionado pelo projeto que nasce a partir daqui.

Ver `docs/plugin-play-strategy.md` para o histórico de decisões que levaram a
este template, e `AGENTS.md` para as regras que qualquer agente/IA deve seguir
ao trabalhar neste repositório.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript.
- Tailwind CSS v4 + componentes no estilo shadcn/base-ui (`@base-ui/react`).
- TanStack Query + TanStack Table.
- react-hook-form + zod.
- Axios para HTTP; sessão via cookies (JWT) + middleware.
- socket.io-client (opcional, atrás de feature flag).

## Módulos incluídos

### Núcleo administrativo (sempre presente)
Login, Dashboard, Controle de Usuários, Papéis, Permissões, Módulos (Grupos
de Permissão), Sistemas, Parâmetros, Lembretes.

### Organização
Lojas, Grupo de Lojas, Setores, Gerências, Cargos, Colaboradores, Pessoas
(Físicas/Jurídicas), Fornecedores.

### Inventário / financeiro genérico
Unidade de Medida, Grupos de Itens, Sub Grupos de Itens, Itens, Depósitos,
Tabelas de Preço, Centro de Custos, Formas de Pagamento, Motivos de Trocas.

Cada módulo tem uma única entrada em `src/modules/registry.ts` — é ali que se
liga/desliga um módulo, não no código da feature.

## Como configurar para um cliente/projeto novo

1. **Branding**: copie `.env.example` para `.env.local` e preencha as
   variáveis `NEXT_PUBLIC_BRAND_*` (título, nome, descrição, redes sociais).
   Não edite `src/config/brand.config.ts` nem `site-config.ts`.
2. **Cores/tema**: edite só `src/themes/brand.css` (ver `DESIGN.md`).
3. **API**: preencha `NEXT_PUBLIC_DEV_API_BASE_URL` /
   `NEXT_PUBLIC_PROD_API_BASE_URL` apontando para o backend real.
4. **Módulos que este cliente não usa**: liste as `key`s em
   `NEXT_PUBLIC_DISABLED_MODULES` (ex: `motivos-trocas,tabelas-precos`).
5. **Funcionalidades pesadas opcionais**: `websocket`, `pwa`, `offline` em
   `src/lib/feature-flags/flags.config.ts`. `offline` é um stub proposital
   (ver `src/lib/offline/utils.ts`) — implemente antes de ligar em produção.
6. **Novo módulo de negócio específico do cliente**: use
   `npm run generate:module` (ver `docs/ai/skills/module-generator`) e depois
   registre a entrada em `src/modules/registry.ts` manualmente — o gerador não
   escreve nele automaticamente ainda.

## O que NÃO deve ser adicionado aqui

Módulos de domínio específico (ex: reservas de quarto, prontuário médico,
comandas de bar) não devem entrar neste template. Eles nascem no projeto
derivado, seguindo o mesmo padrão de módulo (ver
`docs/ai/skills/module-generator`).

## Estado atual / limitações conhecidas

- Sem backend real conectado por padrão — build/lint/navegação funcionam,
  mas criar/listar dados depende de uma API compatível (ver
  `docs/recreate-minimal-project` no projeto de origem para o contrato de
  endpoints esperado, se disponível).
- Subsistema de fila offline (IndexedDB/service worker) não está implementado,
  só stubado.
- Um registry privado de componentes (`@kso`) foi cogitado mas
  deliberadamente **não** foi criado ainda — ver
  `docs/plugin-play-strategy.md` para o motivo (esperar provar valor em um
  segundo projeto real antes de investir nisso).
