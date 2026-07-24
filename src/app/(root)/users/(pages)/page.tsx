import { MODULE_CONFIG, PERMISSIONS } from "@/features/(seguranca)/users/utils/module-utils";
import { UsersFeature } from "@/features/(seguranca)/users/feature";
import { AuthGuard } from "@/lib/auth";

export default function Page() {
  return (
    <AuthGuard can={[PERMISSIONS.view]} groupSlug={MODULE_CONFIG.moduleSlug}>
      <UsersFeature />
    </AuthGuard>
  );
}
