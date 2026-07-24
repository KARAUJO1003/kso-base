import { AuthGuard } from "@/lib/auth/components/auth-guard";
import { LojaFeature } from "@/features/(cadastros)/lojas/feature";
import {
  PERMISSIONS,
  MODULE_CONFIG,
} from "@/features/(cadastros)/lojas/utils/module-utils";

export default function Page() {
  return (
    <AuthGuard can={[PERMISSIONS.view]} groupSlug={MODULE_CONFIG.moduleSlug}>
      <LojaFeature />
    </AuthGuard>
  );
}
