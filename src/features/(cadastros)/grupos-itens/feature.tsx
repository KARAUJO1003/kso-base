import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableGrupoIten } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormGrupoItenModal } from "./components/form-grupos-itens";

export function GrupoItenFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Grupos de Itens</PageTitle>
        <PageDescription>Gerenciamento de Grupos de Itens.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableGrupoIten />
        <FormGrupoItenModal />
      </PageContent>
    </PageContainer>
  );
}
