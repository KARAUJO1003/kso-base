import { AuthGuard } from "@/lib/auth/components/auth-guard";
import { PessoaFeature } from "@/features/(cadastros)/pessoas/feature";
import {
  PERMISSIONS,
  MODULE_CONFIG,
} from "@/features/(cadastros)/pessoas/utils/module-utils";
export default function Page() {
  return (
    <AuthGuard can={[PERMISSIONS.view]} groupSlug={MODULE_CONFIG.moduleSlug}>
      <PessoaFeature />
    </AuthGuard>
  );
}
