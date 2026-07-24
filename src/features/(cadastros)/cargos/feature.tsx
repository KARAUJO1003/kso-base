import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableCargo } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormCargoModal } from "./components/form-cargos";

export function CargoFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Cargos</PageTitle>
        <PageDescription>Gerenciamento de Cargos.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableCargo />
        <FormCargoModal />
      </PageContent>
    </PageContainer>
  );
}
