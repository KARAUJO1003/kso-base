import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableGerencia } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormGerenciaModal } from "./components/form-gerencia";

export function GerenciaFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Gerências</PageTitle>
        <PageDescription>Gerenciamento de Gerências.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableGerencia />
        <FormGerenciaModal />
      </PageContent>
    </PageContainer>
  );
}
