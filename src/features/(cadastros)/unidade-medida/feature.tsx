import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableUnidadeMedida } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormUnidadeMedidaModal } from "./components/form-unidade-medida";

export function UnidadeMedidaFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Unidade de Medida</PageTitle>
        <PageDescription>Gerenciamento de Unidade de Medida.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableUnidadeMedida />
        <FormUnidadeMedidaModal />
      </PageContent>
    </PageContainer>
  );
}
