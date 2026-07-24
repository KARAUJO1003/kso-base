import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { PermissionsTable } from "./components/permissions-table";

export function PermissionsFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Permissões</PageTitle>
        <PageDescription>Gerenciamento de permissões.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <PermissionsTable />
      </PageContent>
    </PageContainer>
  );
}
