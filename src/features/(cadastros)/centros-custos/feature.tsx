import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableCentroCusto } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormCentroCustoModal } from "./components/form-centros-custos";

export function CentroCustoFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Centros de Custos</PageTitle>
        <PageDescription>Gerenciamento de Centros de Custos.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableCentroCusto />
        <FormCentroCustoModal />
      </PageContent>
    </PageContainer>
  );
}
