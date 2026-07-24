import { RootLayoutContent } from "@/components/layout/root-layout-content";
import { ProtectedProviders } from "@/providers/protected-providers";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedProviders>
      <RootLayoutContent>{children}</RootLayoutContent>
    </ProtectedProviders>
  );
}
