import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableGrupoLoja } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormGrupoLojaModal } from "./components/form-grupos-lojas";

export function GrupoLojaFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Grupo de Lojas</PageTitle>
        <PageDescription>Gerenciamento de Grupo de Lojas.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableGrupoLoja />
        <FormGrupoLojaModal />
      </PageContent>
    </PageContainer>
  );
}
