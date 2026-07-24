import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { RolesTable } from "./components/roles-table";

export function RolesFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Roles</PageTitle>
        <PageDescription>Gerenciamento de papéis de acesso.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <RolesTable />
      </PageContent>
    </PageContainer>
  );
}
