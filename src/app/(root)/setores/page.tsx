import { AuthGuard } from "@/lib/auth/components/auth-guard";
import { SetoresFeature } from "@/features/(cadastros)/setores/feature";
import {
  MODULE_CONFIG,
  PERMISSIONS,
} from "@/features/(cadastros)/setores/utils/module-utils";

export default function SetoresPage() {
  return (
    <AuthGuard can={[PERMISSIONS.view]} groupSlug={MODULE_CONFIG.moduleSlug}>
      <SetoresFeature />
    </AuthGuard>
  );
}
