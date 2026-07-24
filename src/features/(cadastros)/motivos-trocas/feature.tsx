import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableMotivoTroca } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormMotivoTrocaModal } from "./components/form-motivos-trocas";

export function MotivoTrocaFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Motivos de Trocas</PageTitle>
        <PageDescription>Gerenciamento de Motivos de Trocas.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableMotivoTroca />
        <FormMotivoTrocaModal />
      </PageContent>
    </PageContainer>
  );
}
