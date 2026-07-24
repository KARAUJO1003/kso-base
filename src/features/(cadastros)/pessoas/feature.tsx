import { PageContainer, PageHeader, PageTitle, PageDescription, PageContent } from "@/components/layout/page-container";
import { TablePessoa } from "./components/table";
import { Separator } from "@/components/ui/separator";
import { FormPessoaModal } from "./components/form-pessoas";

export function PessoaFeature() {
  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>Pessoas</PageTitle>
        <PageDescription>Gerenciamento de Pessoas.</PageDescription>
      </PageHeader>
      <Separator />
      <PageContent>
        <TablePessoa />
        <FormPessoaModal />
      </PageContent>
    </PageContainer>
  );
}
