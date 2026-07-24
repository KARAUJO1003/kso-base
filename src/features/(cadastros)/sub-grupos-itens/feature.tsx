import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableSubGrupoIten } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormSubGrupoItenModal } from "./components/form-sub-grupos-itens";

export function SubGrupoItenFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Sub Grupo de Itens</PageTitle>
        <PageDescription>Gerenciamento de Sub Grupo de Itens.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableSubGrupoIten />
        <FormSubGrupoItenModal />
      </PageContent>
    </PageContainer>
  );
}
