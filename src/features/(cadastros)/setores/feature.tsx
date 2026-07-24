import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableSetor } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormSetorModal } from "./components/form-setores";

export function SetoresFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Setores</PageTitle>
        <PageDescription>Gerenciamento de Setores.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableSetor />
        <FormSetorModal />
      </PageContent>
    </PageContainer>
  );
}
