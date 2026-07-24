import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { UsersTable } from "./components/users-table";

export function UsersFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Usuários</PageTitle>
        <PageDescription>Gerenciamento de usuários.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <UsersTable />
      </PageContent>
    </PageContainer>
  );
}
