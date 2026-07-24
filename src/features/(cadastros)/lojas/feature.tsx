import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableLoja } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormLojaModal } from "./components/form-lojas";

export function LojaFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Lojas</PageTitle>
        <PageDescription>Gerenciamento de Lojas.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableLoja />
        <FormLojaModal />
      </PageContent>
    </PageContainer>
  );
}
