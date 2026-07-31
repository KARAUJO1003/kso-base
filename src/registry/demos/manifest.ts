import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Mapa manual nome -> demo + arquivos reais pra mostrar em /components.
 * Cada entrada é conteúdo novo (arquivo de demo em src/registry/demos/) —
 * ao contrário de /blocks, aqui não tem como derivar automaticamente do
 * registry.json porque um componente avulso não tem rota própria pra
 * embedar via iframe. Adicionar um componente novo é: escrever
 * src/registry/demos/<nome>-demo.tsx + uma entrada aqui.
 */
export interface ComponentManifestEntry {
  name: string;
  title: string;
  description: string;
  /** Nome pro comando de instalação: "card" (shadcn público) ou "@kso/x" (registry próprio). */
  packageName: string;
  /** Arquivo real do componente em si, mostrado na seção Installation > Manual. */
  file: string;
  Demo: ComponentType;
}

export const COMPONENT_MANIFEST: ComponentManifestEntry[] = [
  {
    name: "card",
    title: "Card",
    description: "Exibe um card com header, conteúdo e footer.",
    packageName: "card",
    file: "src/components/ui/card.tsx",
    Demo: dynamic(() => import("./card-demo")),
  },
  {
    name: "button",
    title: "Button",
    description: "Exibe um botão ou um componente que se parece com um botão.",
    packageName: "button",
    file: "src/components/ui/button.tsx",
    Demo: dynamic(() => import("./button-demo")),
  },
  {
    name: "badge",
    title: "Badge",
    description: "Exibe um badge ou um componente que se parece com um badge.",
    packageName: "badge",
    file: "src/components/ui/badge.tsx",
    Demo: dynamic(() => import("./badge-demo")),
  },
  {
    name: "avatar",
    title: "Avatar",
    description: "Elemento de imagem com fallback, pensado pra representar o usuário.",
    packageName: "avatar",
    file: "src/components/ui/avatar.tsx",
    Demo: dynamic(() => import("./avatar-demo")),
  },
  {
    name: "alert",
    title: "Alert",
    description: "Exibe uma mensagem de alerta chamativa.",
    packageName: "alert",
    file: "src/components/ui/alert.tsx",
    Demo: dynamic(() => import("./alert-demo")),
  },
  {
    name: "alert-dialog",
    title: "Alert Dialog",
    description: "Modal que interrompe o usuário com conteúdo importante e espera uma resposta.",
    packageName: "alert-dialog",
    file: "src/components/ui/alert-dialog.tsx",
    Demo: dynamic(() => import("./alert-dialog-demo")),
  },
  {
    name: "checkbox",
    title: "Checkbox",
    description: "Controle que permite ao usuário marcar/desmarcar uma opção.",
    packageName: "checkbox",
    file: "src/components/ui/checkbox.tsx",
    Demo: dynamic(() => import("./checkbox-demo")),
  },
  {
    name: "switch",
    title: "Switch",
    description: "Controle que permite ao usuário alternar entre ligado e desligado.",
    packageName: "switch",
    file: "src/components/ui/switch.tsx",
    Demo: dynamic(() => import("./switch-demo")),
  },
  {
    name: "select",
    title: "Select",
    description: "Exibe uma lista de opções pro usuário escolher — dispara um popup nativo em mobile.",
    packageName: "select",
    file: "src/components/ui/select.tsx",
    Demo: dynamic(() => import("./select-demo")),
  },
  {
    name: "radio-group",
    title: "Radio Group",
    description: "Conjunto de opções de rádio, onde só uma pode ser marcada por vez.",
    packageName: "radio-group",
    file: "src/components/ui/radio-group.tsx",
    Demo: dynamic(() => import("./radio-group-demo")),
  },
  {
    name: "tabs",
    title: "Tabs",
    description: "Conjunto de seções em camadas de conteúdo, exibidas uma de cada vez.",
    packageName: "tabs",
    file: "src/components/ui/tabs.tsx",
    Demo: dynamic(() => import("./tabs-demo")),
  },
  {
    name: "accordion",
    title: "Accordion",
    description: "Conjunto de cabeçalhos empilhados que revelam uma seção de conteúdo cada.",
    packageName: "accordion",
    file: "src/components/ui/accordion.tsx",
    Demo: dynamic(() => import("./accordion-demo")),
  },
  {
    name: "separator",
    title: "Separator",
    description: "Separa visualmente ou semanticamente o conteúdo.",
    packageName: "separator",
    file: "src/components/ui/separator.tsx",
    Demo: dynamic(() => import("./separator-demo")),
  },
  {
    name: "skeleton",
    title: "Skeleton",
    description: "Usado pra mostrar um placeholder enquanto o conteúdo carrega.",
    packageName: "skeleton",
    file: "src/components/ui/skeleton.tsx",
    Demo: dynamic(() => import("./skeleton-demo")),
  },
  {
    name: "progress",
    title: "Progress",
    description: "Exibe um indicador mostrando o progresso de conclusão de uma tarefa.",
    packageName: "progress",
    file: "src/components/ui/progress.tsx",
    Demo: dynamic(() => import("./progress-demo")),
  },
  {
    name: "textarea",
    title: "Textarea",
    description: "Exibe um campo de formulário de texto multi-linha.",
    packageName: "textarea",
    file: "src/components/ui/textarea.tsx",
    Demo: dynamic(() => import("./textarea-demo")),
  },
  {
    name: "input",
    title: "Input",
    description: "Exibe um campo de formulário ou um componente que se parece com um campo.",
    packageName: "input",
    file: "src/components/ui/input.tsx",
    Demo: dynamic(() => import("./input-demo")),
  },
  {
    name: "tooltip",
    title: "Tooltip",
    description: "Popup que exibe informação relacionada a um elemento quando ele recebe foco/hover.",
    packageName: "tooltip",
    file: "src/components/ui/tooltip.tsx",
    Demo: dynamic(() => import("./tooltip-demo")),
  },
  {
    name: "popover",
    title: "Popover",
    description: "Exibe conteúdo rico em um popup, disparado por um botão.",
    packageName: "popover",
    file: "src/components/ui/popover.tsx",
    Demo: dynamic(() => import("./popover-demo")),
  },
  {
    name: "dialog",
    title: "Dialog",
    description: "Janela sobreposta ao conteúdo principal, encerrando a interação com o app.",
    packageName: "dialog",
    file: "src/components/ui/dialog.tsx",
    Demo: dynamic(() => import("./dialog-demo")),
  },
  {
    name: "breadcrumb",
    title: "Breadcrumb",
    description: "Exibe o caminho pra página atual, mostrando a hierarquia de navegação.",
    packageName: "breadcrumb",
    file: "src/components/ui/breadcrumb.tsx",
    Demo: dynamic(() => import("./breadcrumb-demo")),
  },
  {
    name: "dropdown-menu",
    title: "Dropdown Menu",
    description: "Exibe um menu pro usuário, disparado por um botão.",
    packageName: "dropdown-menu",
    file: "src/components/ui/dropdown-menu.tsx",
    Demo: dynamic(() => import("./dropdown-menu-demo")),
  },
  {
    name: "table",
    title: "Table",
    description: "Uma tabela responsiva pra exibir dados.",
    packageName: "table",
    file: "src/components/ui/table.tsx",
    Demo: dynamic(() => import("./table-demo")),
  },
  {
    name: "sheet",
    title: "Sheet",
    description: "Estende o componente Dialog pra exibir conteúdo complementar à tela principal.",
    packageName: "sheet",
    file: "src/components/ui/sheet.tsx",
    Demo: dynamic(() => import("./sheet-demo")),
  },
  {
    name: "input-otp",
    title: "Input OTP",
    description: "Componente de campo de entrada com suporte a código de uso único.",
    packageName: "input-otp",
    file: "src/components/ui/input-otp.tsx",
    Demo: dynamic(() => import("./input-otp-demo")),
  },
  {
    name: "toggle",
    title: "Toggle",
    description: "Botão de duas posições, que pode estar ligado ou desligado.",
    packageName: "toggle",
    file: "src/components/ui/toggle.tsx",
    Demo: dynamic(() => import("./toggle-demo")),
  },
  {
    name: "toggle-group",
    title: "Toggle Group",
    description: "Conjunto de botões de duas posições, agrupados.",
    packageName: "toggle-group",
    file: "src/components/ui/toggle-group.tsx",
    Demo: dynamic(() => import("./toggle-group-demo")),
  },
];

export function getComponentManifestEntry(name: string) {
  return COMPONENT_MANIFEST.find((entry) => entry.name === name);
}
