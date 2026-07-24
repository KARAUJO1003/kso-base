import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableColaborador } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormColaboradorModal } from "./components/form-colaboradores";

export function ColaboradorFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Colaboradores</PageTitle>
        <PageDescription>Gerenciamento de Colaboradores.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableColaborador />
        <FormColaboradorModal />
      </PageContent>
    </PageContainer>
  );
}
