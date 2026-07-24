import { AuthGuard } from "@/lib/auth/components/auth-guard";
import { GrupoItenFeature } from "@/features/(cadastros)/grupos-itens/feature";
import { PERMISSIONS, MODULE_CONFIG } from "@/features/(cadastros)/grupos-itens/utils/module-utils";

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
      <GrupoItenFeature />
    </AuthGuard>
  );
}
