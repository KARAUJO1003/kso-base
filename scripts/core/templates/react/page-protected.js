/**
 * Template for protected page with AuthGuard
 * @module page-protected
 */

/**
 * Generate protected page.tsx template
 * @param {object} params - Template parameters
 * @param {string} params.PASCAL - PascalCase module name
 * @param {string} params.KEBAB - kebab-case module name
 * @returns {string} Page template
 */
export function pageProtectedTemplate(params) {
  const { PASCAL, KEBAB } = params;

  return `import { AuthGuard } from "@/lib/auth/components/auth-guard";
import { ${PASCAL}Feature } from "@/features/(cadastros)/${KEBAB}/feature";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/${KEBAB}/utils/module-utils";

/**
 * Página protegida por AuthGuard.
 * 
 * O AuthGuard valida permissões uma única vez e fornece o contexto
 * para componentes filhos usarem o componente <Can> sem novas requisições.
 * 
 * @example Uso do componente Can dentro da feature
 * import { Can } from "@/lib/auth";
 * 
 * <Can can={["criar"]}>
 *   <Button>Criar</Button>
 * </Can>
 * 
 * <Can can={["editar"]} fallback={<Tooltip>Sem permissão</Tooltip>}>
 *   <Button>Editar</Button>
 * </Can>
 * 
 * <Can can={["editar", "excluir"]} mode="any">
 *   <DropdownMenu>...</DropdownMenu>
 * </Can>
 */
export default function Page() {
  return (
    <AuthGuard can={[PERMISSIONS.view]} groupSlug={MODULE_CONFIG.moduleSlug}>
      <${PASCAL}Feature />
    </AuthGuard>
  );
}
`;
}
