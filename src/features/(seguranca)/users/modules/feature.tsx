import {
  PageContainer,
  PageContent,
  PageDescription,
  PageHeader,
  PageTitle,
} from "@/components/layout/page-container";
import { Separator } from "@/components/ui/separator";
import { ModulesTable } from "./components/modules-table";

export function ModulesFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Grupos de Permissão</PageTitle>
        <PageDescription>
          Gerenciamento dos grupos usados para organizar permissões.
        </PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <ModulesTable />
      </PageContent>
    </PageContainer>
  );
}
