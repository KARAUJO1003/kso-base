import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TableFornecedor } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormFornecedorModal } from "./components/form-fornecedores";

export function FornecedorFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Fornecedores</PageTitle>
        <PageDescription>Gerenciamento de Fornecedores.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TableFornecedor />
        <FormFornecedorModal />
      </PageContent>
    </PageContainer>
  );
}
